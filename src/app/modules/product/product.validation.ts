import { z } from 'zod';
import { Compaitbility, Condition, Interface } from './product.constant';

const productValidation = z.object({
  body: z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    category: z.string(),
    brand: z.string(),
    condition: z.enum([...Condition] as [string, ...string[]]),
    compatibility: z
      .enum([...Compaitbility] as [string, ...string[]])
      .optional(),
    interface: z.enum([...Interface] as [string, ...string[]]).optional(),
    capacity: z.string().optional(),
    color: z.string().optional(),
    formFactor: z.string().optional(),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    condition: z.enum([...Condition] as [string, ...string[]]).optional(),
    compatibility: z
      .enum([...Compaitbility] as [string, ...string[]])
      .optional(),
    interface: z.enum([...Interface] as [string, ...string[]]).optional(),
    capacity: z.string().optional(),
    color: z.string().optional(),
    formFactor: z.string().optional(),
  }),
});

export const ProductValidations = {
  productValidation,
  updateProductValidation,
};
