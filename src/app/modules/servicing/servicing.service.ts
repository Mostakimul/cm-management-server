import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { USER_ROLE } from '../user/user.constant';
import { User } from '../user/user.model';
import { TServicing } from './servicing.interface';
import { Servicing } from './servicing.model';

const createServicingService = async (
  payload: TServicing,
  user: JwtPayload,
) => {
  const existingUser = await User.findOne({
    email: user?.email,
  });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  if (existingUser.role !== USER_ROLE.buyer) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not a buyer!');
  }

  payload.buyer = existingUser._id;

  const result = await Servicing.create(payload);
  return result;
};

export const ServicingServices = {
  createServicingService,
};
