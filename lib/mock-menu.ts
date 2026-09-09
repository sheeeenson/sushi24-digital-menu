import type { NormalizedMenu } from './types';

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export function getMockMenu(location: string): NormalizedMenu {
  return {
    location,
    fetchedAt: new Date().toISOString(),
    revision: 1,
    categories: [
      { id: 'sets', name: 'Sets', items: [
        { id: 'vay-may', name: 'Vay May Set', description: '40 pcs', price: 69.8, oldPrice: 139.8, available: true, imageUrl: img('photo-1579871494447-9811cf80d66c') },
        { id: 'warm-set', name: 'Warm Set', description: '32 pcs', price: 72.6, oldPrice: 103.6, available: true, imageUrl: img('photo-1553621042-f6e147245754') },
        { id: 'love-set', name: 'Love Set', description: '32 pcs', price: 66.9, available: true, imageUrl: img('photo-1611143669185-af224c5e3252') },
        { id: 'omg-set', name: 'OMG Set', description: '32 pcs', price: 79.6, available: true, imageUrl: img('photo-1563612116625-3012372fccce') }
      ]},
      { id: 'rolls', name: 'Rolls', items: [
        { id: 'phila', name: 'Philadelphia Classic', description: '8 pcs', price: 16.9, oldPrice: 26.9, available: true, imageUrl: img('photo-1617196034796-73dfa7b1fd56') },
        { id: 'premium', name: 'Philadelphia Premium', description: '8 pcs', price: 25.9, oldPrice: 36.9, available: true, imageUrl: img('photo-1579584425555-c3ce17fd4351') },
        { id: 'caesar', name: 'Caesar Roll', description: '8 pcs', price: 18.9, available: true, imageUrl: img('photo-1558985250-27a406d64cb3') }
      ]},
      { id: 'wok', name: 'WOK', items: [
        { id: 'chicken-noodle', name: 'Chicken Noodle WOK', description: 'Chicken, vegetables, noodles', price: 10.9, oldPrice: 20.9, available: true, imageUrl: img('photo-1612929633738-8fe44f7ec841') },
        { id: 'teriyaki', name: 'Chicken Teriyaki Noodles', description: 'Chicken, vegetables, teriyaki', price: 16.9, available: true, imageUrl: img('photo-1552611052-33e04de081de') }
      ]}
    ]
  };
}
