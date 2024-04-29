import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import pick from '../../../shared/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SALE_FILTERABLE } from './sale.constant';
import { SaleServices } from './sale.service';

const createSale = catchAsync(async (req, res) => {
  const result = await SaleServices.createSaleService(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product sold successfully',
    data: result,
  });
});

const getAllSale = catchAsync(async (req, res) => {
  const filters = pick(req.query, SALE_FILTERABLE);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SaleServices.getAllSaleService(
    filters,
    paginationOptions,
    req.user,
  );

  sendResponse(res, {
    success: true,
    message: 'All Sales fetched successfully',
    data: result.data,
    meta: result.meta,
    statusCode: httpStatus.OK,
  });
});

export const SaleController = {
  createSale,
  getAllSale,
};
