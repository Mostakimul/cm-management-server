import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(UserValidation.userValidationSchema),
  UserController.createAdmin,
);
router.post(
  '/create-buyer',
  validateRequest(UserValidation.userValidationSchema),
  UserController.createBuyer,
);
router.post(
  '/create-seller',
  validateRequest(UserValidation.userValidationSchema),
  UserController.createSeller,
);

export const UserRoutes = router;
