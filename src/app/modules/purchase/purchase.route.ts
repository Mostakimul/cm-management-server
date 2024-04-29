import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { PurchaseController } from './purchase.controller';
import { PurchaseValidations } from './purchase.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.buyer),
  validateRequest(PurchaseValidations.purchaseValidation),
  PurchaseController.createPurchase,
);

router.get(
  '/',
  auth(USER_ROLE.buyer, USER_ROLE.admin),
  PurchaseController.getAllPurchase,
);

export const PurchaseRoutes = router;
