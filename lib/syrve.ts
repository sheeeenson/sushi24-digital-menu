import type { MenuCategory, MenuItem, NormalizedMenu } from './types';
import { getMockMenu } from './mock-menu';

const baseUrl = process.env.SYRVE_BASE_URL || 'https://api-eu.syrve.live';
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken() {
  const apiLogin = process.env.SYRVE_API_LOGIN;
  if (!apiLogin) throw new Error('SYRVE_API_LOGIN is missing');
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.token;

  const response = await fetch(`${baseUrl}/api/1/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiLogin }),
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(`Syrve auth failed: ${response.status}`);
  const data = await response.json();
  tokenCache = { token: data.token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return data.token as string;
}

function getOrganizationId(location: string) {
  const raw = process.env.SYRVE_ORGANIZATIONS;
  if (!raw) throw new Error('SYRVE_ORGANIZATIONS is missing');
  const map = JSON.parse(raw) as Record<string, string>;
  const id = map[location];
  if (!id) throw new Error(`No Syrve organization mapped for location: ${location}`);
  return id;
}

function pickImage(item: any, size: any) {
  const candidates = [size?.buttonImageUrl, ...(Array.isArray(size?.buttonImageCroppedUrl) ? size.buttonImageCroppedUrl : []), item?.buttonImageUrl, ...(Array.isArray(item?.buttonImageCroppedUrl) ? item.buttonImageCroppedUrl : [])];
  return candidates.find((url) => typeof url === 'string' && url.startsWith('http'));
}

function pickPrice(size: any, organizationId: string) {
  const prices = Array.isArray(size?.prices) ? size.prices : [];
  const orgPrice = prices.find((p: any) => p.organizationId === organizationId) ?? prices[0];
  if (!orgPrice || orgPrice.price === null || orgPrice.price === undefined) return { price: 0, available: false };
  return { price: Number(orgPrice.price), available: true };
}

function normalizeItem(item: any, organizationId: string): MenuItem | null {
  const sizes = Array.isArray(item?.itemSizes) ? item.itemSizes : [];
  const size = sizes.find((s: any) => s.isDefault) ?? sizes[0];
  if (!size) return null;
  const { price, available } = pickPrice(size, organizationId);
  return {
    id: String(item.itemId ?? item.id ?? item.sku ?? item.name),
    name: String(item.name ?? ''),
    description: item.description ? String(item.description) : undefined,
    price,
    available,
    imageUrl: pickImage(item, size)
  };
}

function normalizeMenu(raw: any, location: string, organizationId: string): NormalizedMenu {
  const sourceCategories = raw.itemCategories ?? raw.productCategories ?? [];
  const categories: MenuCategory[] = sourceCategories.map((category: any) => ({
    id: String(category.id ?? category.name),
    name: String(category.name ?? ''),
    items: (category.items ?? category.products ?? []).map((item: any) => normalizeItem(item, organizationId)).filter(Boolean) as MenuItem[]
  })).filter((category: MenuCategory) => category.items.length > 0);
  return { revision: raw.revision, location, fetchedAt: new Date().toISOString(), categories };
}

export async function fetchMenu(location: string): Promise<NormalizedMenu> {
  if (!process.env.SYRVE_API_LOGIN || !process.env.SYRVE_EXTERNAL_MENU_ID || !process.env.SYRVE_ORGANIZATIONS) return getMockMenu(location);
  const organizationId = getOrganizationId(location);
  const token = await getAccessToken();
  const response = await fetch(`${baseUrl}/api/2/menu/by_id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ externalMenuId: process.env.SYRVE_EXTERNAL_MENU_ID, organizationIds: [organizationId], version: 2 }),
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(`Syrve menu failed: ${response.status}`);
  return normalizeMenu(await response.json(), location, organizationId);
}
