import { TCompatibility, TCondition, TInterface } from './product.interface';

export const Compaitbility: TCompatibility[] = [
  'Windows',
  'Mac Os',
  'Linux',
  'Others',
];
export const Interface: TInterface[] = ['USB', 'HDMI', 'Thunderbolt', 'Others'];
export const Condition: TCondition[] = ['New', 'Used'];

export const PRODUCT_SEARCHABLE = ['name'];

export const PRODUCT_FILTERABLE = [
  'searchTerm',
  'name',
  'category',
  'brand',
  'compatibility',
  'price',
  'interface',
  'condition',
  'capacity',
  'color',
  'formFactor',
];
