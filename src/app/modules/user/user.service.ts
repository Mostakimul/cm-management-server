/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

const createAdminService = async (payload: TUser) => {
  // * Check if user already exist
  const isUserExist = await User.isUserExistsByEmail(payload.email);

  // * Show error if user exist
  if (isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User already exist!');
  }

  payload.role = 'admin';

  const result = await User.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new user!');
  }

  return result;
};

const createBuyerService = async (payload: TUser) => {
  // * Check if user already exist
  const isUserExist = await User.isUserExistsByEmail(payload.email);

  // * Show error if user exist
  if (isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User already exist!');
  }

  payload.role = 'buyer';

  const result = await User.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new buyer!');
  }

  return result;
};

const createSellerService = async (payload: TUser) => {
  // * Check if user already exist
  const isUserExist = await User.isUserExistsByEmail(payload.email);

  // * Show error if user exist
  if (isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User already exist!');
  }

  payload.role = 'seller';

  const result = await User.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new buyer!');
  }

  return result;
};
export const UserServices = {
  createAdminService,
  createBuyerService,
  createSellerService,
};
