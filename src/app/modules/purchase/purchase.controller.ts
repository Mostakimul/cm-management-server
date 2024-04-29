import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import pick from '../../../shared/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PURCHASE_FILTERABLE } from './purchase.constant';
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

const getAllPurchase = catchAsync(async (req, res) => {
  const filters = pick(req.query, PURCHASE_FILTERABLE);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PurchaseServices.getAllPurchaseService(
    filters,
    paginationOptions,
    req.user,
  );

  sendResponse(res, {
    success: true,
    message: 'All purchase fetched successfully',
    data: result.data,
    meta: result.meta,
    statusCode: httpStatus.OK,
  });
});

export const PurchaseController = {
  createPurchase,
  getAllPurchase,
};
