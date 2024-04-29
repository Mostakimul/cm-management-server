import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SaleController } from './sale.controller';
import { SaleValidations } from './sale.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(SaleValidations.saleValidation),
  SaleController.createSale,
);

router.get('/', SaleController.getAllSale);

export const SaleRoutes = router;
