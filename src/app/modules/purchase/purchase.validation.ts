import { z } from 'zod';

const purchaseValidation = z.object({
  body: z.object({
    product: z.string(),
    quantity: z.number(),
    purchaseDate: z.string(),
  }),
});

export const PurchaseValidations = {
  purchaseValidation,
};
