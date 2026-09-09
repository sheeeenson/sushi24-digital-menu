import { NextResponse } from 'next/server';
import { getLocationConfig } from '@/config/screens';
import { fetchMenu } from '@/lib/syrve';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  if (!getLocationConfig(location)) {
    return NextResponse.json({ error: 'Unknown location' }, { status: 404 });
  }
  try {
    const menu = await fetchMenu(location);
    return NextResponse.json(menu, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('Syrve menu refresh failed', error);
    return NextResponse.json({ error: 'Menu refresh failed' }, { status: 502 });
  }
}
