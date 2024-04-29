import { Model, Types } from 'mongoose';
import { TProduct } from '../product/product.interface';

export type TPurchase = {
  product: Types.ObjectId | TProduct;
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  quantity: number;
  totalAmount: number;
  purchaseDate: Date;
};

export type PurchaseModel = Model<TPurchase, Record<string, unknown>>;

export type TPurchaseFilters = {
  searchTerm?: string;
};
