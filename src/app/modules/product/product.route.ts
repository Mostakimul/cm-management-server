import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidations } from './product.validation';

const router = express.Router();

router.get('/', ProductController.getAllProduct);
router.get('/:id', ProductController.getSingleProduct);

router.post(
  '/',
  validateRequest(ProductValidations.productValidation),
  ProductController.createProduct,
);

router.patch(
  '/:id',
  validateRequest(ProductValidations.updateProductValidation),
  ProductController.updateProduct,
);

router.delete('/:id', ProductController.deleteProduct);
router.post('/bulk-delete', ProductController.bulkdeleteProduct);

export const ProductRoutes = router;
