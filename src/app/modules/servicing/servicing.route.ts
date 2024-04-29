import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { ServicingController } from './servicing.controller';
import { ServiceValidations } from './servicing.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.buyer),
  validateRequest(ServiceValidations.servicingValidation),
  ServicingController.createServicing,
);

export const ServicingRoutes = router;
