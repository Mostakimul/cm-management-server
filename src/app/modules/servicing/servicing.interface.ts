import { Model, Types } from 'mongoose';

export type TServicing = {
  partsDetails: string;
  issue: string;
  serviceDate: Date;
  buyer: Types.ObjectId;
};

export type ServiceModel = Model<TServicing, Record<string, unknown>>;
