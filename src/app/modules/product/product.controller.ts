/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import pick from '../../../shared/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PRODUCT_FILTERABLE } from './product.constant';
import { ProductServices } from './product.service';

const getAllProduct = catchAsync(async (req, res) => {
  const filters = pick(req.query, PRODUCT_FILTERABLE);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ProductServices.getAllProductService(
    filters,
    paginationOptions,
  );

  sendResponse(res, {
    success: true,
    message: 'All product fetched successfully',
    data: result.data,
    meta: result.meta,
    statusCode: httpStatus.OK,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ProductServices.getSingleProductService(id);

  sendResponse(res, {
    success: true,
    message: 'Product fetched successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const result = await ProductServices.createProductService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const bulkdeleteProduct = catchAsync(async (req, res, next) => {
  const productIds = req.body.productIds;

  const result = await ProductServices.bulkdeleteProductsService(productIds);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products deleted successfully',
    data: result,
  });
});
const deleteProduct = catchAsync(async (req, res, next) => {
  const result = await ProductServices.deleteProductService(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await ProductServices.updateProductService(id, updatedData);

  sendResponse(res, {
    success: true,
    message: 'Product updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const ProductController = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  getSingleProduct,
  bulkdeleteProduct,
};
