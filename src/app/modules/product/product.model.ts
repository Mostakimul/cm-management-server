import { Schema, model } from 'mongoose';
import { Compaitbility, Interface } from './product.constant';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    compatibility: {
      type: String,
      enum: Compaitbility,
    },
    interface: {
      type: String,
      enum: Interface,
    },
    capacity: {
      type: String,
    },
    color: {
      type: String,
    },
    formFactor: {
      type: String,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>('Product', productSchema);
