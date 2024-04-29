import { Schema, model } from 'mongoose';
import { PurchaseModel, TPurchase } from './purchase.interface';

export const PurchaseSchema = new Schema<TPurchase, PurchaseModel>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    purchaseDate: {
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

export const Purchase = model<TPurchase, PurchaseModel>(
  'Purchase',
  PurchaseSchema,
);
