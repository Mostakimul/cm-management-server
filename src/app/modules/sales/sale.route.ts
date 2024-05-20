import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { SaleController } from './sale.controller';
import { SaleValidations } from './sale.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.seller),
  validateRequest(SaleValidations.saleValidation),
  SaleController.createSale,
);

router.get(
  '/:id',
  auth(USER_ROLE.seller, USER_ROLE.admin),
  SaleController.getSingleSale,
);

router.get(
  '/',
  auth(USER_ROLE.seller, USER_ROLE.admin),
  SaleController.getAllSale,
);

export const SaleRoutes = router;
