/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserService = async (payload: TUser) => {
  // * Check if user already exist
  const isUserExist = await User.isUserExistsByEmail(payload.email);

  // * Show error if user exist
  if (isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User already exist!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newUser = await User.create([payload], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new user!');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUser[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create user!');
  }
};
export const UserServices = {
  createUserService,
};
