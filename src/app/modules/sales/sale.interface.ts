import { Model, Types } from 'mongoose';
import { TProduct } from '../product/product.interface';

export type TSale = {
  productId: Types.ObjectId | TProduct;
  quantity: number;
  buyerName: string;
  date: Date;
  totalAmount: number;
  seller: Types.ObjectId;
};

export type SaleModel = Model<TSale, Record<string, unknown>>;

export type TSaleFilters = {
  searchTerm?: string;
  timeFrame?: string;
};
