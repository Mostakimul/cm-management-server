import { z } from 'zod';

const saleValidation = z.object({
  body: z.object({
    productId: z.string(),
    quantity: z.number(),
    buyerName: z.string(),
    date: z.string(),
  }),
});

export const SaleValidations = {
  saleValidation,
};
