import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PurchaseServices } from './purchase.service';

const createPurchase = catchAsync(async (req, res) => {
  const result = await PurchaseServices.createPurchaseService(
    req.body,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product purchased successfully',
    data: result,
  });
});

export const PurchaseController = {
  createPurchase,
};
