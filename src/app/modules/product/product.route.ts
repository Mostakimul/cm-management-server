import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { ProductController } from './product.controller';
import { ProductValidations } from './product.validation';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin),
  ProductController.getAllProduct,
);
router.get(
  '/:id',
  auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin),
  ProductController.getSingleProduct,
);

router.post(
  '/',
  auth(USER_ROLE.seller),
  validateRequest(ProductValidations.productValidation),
  ProductController.createProduct,
);

router.patch(
  '/:id',
  auth(USER_ROLE.seller),
  validateRequest(ProductValidations.updateProductValidation),
  ProductController.updateProduct,
);

router.delete('/:id', auth(USER_ROLE.seller), ProductController.deleteProduct);
router.post(
  '/bulk-delete',
  auth(USER_ROLE.seller),
  ProductController.bulkdeleteProduct,
);

export const ProductRoutes = router;
