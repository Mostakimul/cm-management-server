import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import AppError from '../../errors/AppError';
import { IGenericResponse, IPaginationOptions } from '../../interface/common';
import { User } from '../user/user.model';
import { PRODUCT_SEARCHABLE } from './product.constant';
import { TProduct, TProductFilters } from './product.interface';
import { Product } from './product.model';

const createProductService = async (payload: TProduct, user: JwtPayload) => {
  const existingUser = await User.findOne({
    email: user?.email,
  });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  payload.seller = existingUser?._id;

  const result = (await Product.create(payload)).populate({
    path: 'seller',
  });

  return result;
};

const deleteProductService = async (productId: string, user: JwtPayload) => {
  const isProductExist = await Product.findById(productId);
  if (!isProductExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product does not exist!');
  }

  const existingUser = await User.findOne({
    email: user?.email,
  });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (isProductExist.seller !== existingUser._id) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not seller of this product!',
    );
  }

  const result = await Product.deleteOne({ _id: productId });

  return result;
};

const updateProductService = async (
  id: string,
  payload: Partial<TProduct>,
  user: JwtPayload,
): Promise<TProduct | null> => {
  const isProductExist = await Product.findOne({ _id: id });
  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const existingUser = await User.findOne({
    email: user?.email,
  });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (isProductExist.seller !== existingUser._id) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not seller of this product!',
    );
  }

  const result = await Product.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const getAllProductService = async (
  filters: TProductFilters,
  payload: IPaginationOptions,
): Promise<IGenericResponse<TProduct[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(payload);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: PRODUCT_SEARCHABLE.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Product.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleProductService = async (
  payload: string,
): Promise<TProduct | null> => {
  const result = await Product.findById(payload);
  return result;
};

const bulkdeleteProductsService = async (
  productIds: string[],
  user: JwtPayload,
) => {
  const deletedProductIds = [];

  const existingUser = await User.findOne({
    email: user?.email,
  });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  for (const productId of productIds) {
    const isProductExist = await Product.findById(productId);
    if (!isProductExist) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Product ID:${productId} does not exist!`,
      );
    }

    if (isProductExist.seller !== existingUser._id) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not seller of this product!',
      );
    }

    const result = await Product.deleteOne({ _id: productId });

    if (result.acknowledged === true) {
      deletedProductIds.push(productId);
    }
  }

  return deletedProductIds;
};

export const ProductServices = {
  createProductService,
  deleteProductService,
  updateProductService,
  getAllProductService,
  getSingleProductService,
  bulkdeleteProductsService,
};
