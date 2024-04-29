import { Schema, model } from 'mongoose';
import { SaleModel, TSale } from './sale.interface';

export const SaleSchema = new Schema<TSale, SaleModel>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Sale = model<TSale, SaleModel>('Sale', SaleSchema);
