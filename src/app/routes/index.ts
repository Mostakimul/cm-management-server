import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProductRoutes } from '../modules/product/product.route';
import { PurchaseRoutes } from '../modules/purchase/purchase.route';
import { SaleRoutes } from '../modules/sales/sale.route';
import { ServicingRoutes } from '../modules/servicing/servicing.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/sales',
    route: SaleRoutes,
  },
  {
    path: '/purchase',
    route: PurchaseRoutes,
  },
  {
    path: '/servicing',
    route: ServicingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
