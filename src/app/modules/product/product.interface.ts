export type TCompatibility = 'Windows' | 'Mac Os' | 'Linux' | 'Others';
export type TInterface = 'USB' | 'HDMI' | 'Thunderbolt' | 'Others';
export type TCondition = 'New' | 'Used';

export type TProduct = {
  name: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  condition: string;
  compatibility: string;
  interface: string;
  capacity?: string;
  color: string;
  formFactor: string;
};

export type TProductFilters = {
  searchTerm?: string;
  name?: string;
  category?: string;
  brand?: string;
  compatibility?: string;
  price?: number;
  interface?: string;
  condition?: string;
  capacity?: string;
  color?: string;
  formFactor?: string;
};
