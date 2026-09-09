export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  imageUrl?: string;
  available: boolean;
  tags?: string[];
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type NormalizedMenu = {
  revision?: number;
  location: string;
  fetchedAt: string;
  categories: MenuCategory[];
};

export type LocationConfig = {
  id: string;
  name: string;
  title?: string;
  showDescriptions?: boolean;
  showUnavailable?: boolean;
  refreshSeconds?: number;
};
