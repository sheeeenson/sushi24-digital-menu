import type { LocationConfig } from '@/lib/types';

export const locations: LocationConfig[] = [
  { id: 'isani', name: 'Isani', title: 'MENU', showDescriptions: true, refreshSeconds: 60 },
  { id: 'chikobava', name: 'Chikobava', title: 'MENU', showDescriptions: true, refreshSeconds: 60 },
  { id: 'vazha', name: 'Vazha', title: 'MENU', showDescriptions: true, refreshSeconds: 60 },
  { id: 'digomi', name: 'Digomi', title: 'MENU', showDescriptions: true, refreshSeconds: 60 },
  { id: 'rustavi', name: 'Rustavi', title: 'MENU', showDescriptions: true, refreshSeconds: 60 },
  { id: 'tbilisi-mall', name: 'Tbilisi Mall', title: 'MENU', showDescriptions: true, refreshSeconds: 60 }
];

export function getLocationConfig(location: string) {
  return locations.find((item) => item.id === location);
}
