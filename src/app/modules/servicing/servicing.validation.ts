import { z } from 'zod';

const servicingValidation = z.object({
  body: z.object({
    partsDetails: z.string(),
    issue: z.string(),
    serviceDate: z.string(),
  }),
});

export const ServiceValidations = {
  servicingValidation,
};
