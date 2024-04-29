/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdminService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const createBuyer = catchAsync(async (req, res) => {
  const result = await UserServices.createBuyerService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer created successfully',
    data: result,
  });
});

const createSeller = catchAsync(async (req, res) => {
  const result = await UserServices.createSellerService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller created successfully',
    data: result,
  });
});
export const UserController = {
  createAdmin,
  createBuyer,
  createSeller,
};
