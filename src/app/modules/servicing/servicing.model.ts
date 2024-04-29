import { Schema, model } from 'mongoose';
import { ServiceModel, TServicing } from './servicing.interface';

export const ServiceSchema = new Schema<TServicing, ServiceModel>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    partsDetails: {
      type: String,
      required: true,
    },
    issue: {
      type: String,
      required: true,
    },
    serviceDate: {
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

export const Servicing = model<TServicing, ServiceModel>(
  'Service',
  ServiceSchema,
);
