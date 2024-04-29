import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string({
        invalid_type_error: 'Password must be string',
      })
      .max(20, { message: 'Password cannot be more than 20 characters!' })
      .optional(),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
