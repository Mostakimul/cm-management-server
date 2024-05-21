import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import AppError from '../../errors/AppError';
import { IGenericResponse, IPaginationOptions } from '../../interface/common';
import { USER_ROLE } from '../user/user.constant';
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

  if (existingUser.role !== USER_ROLE.seller) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not a seller!');
  }

  payload.seller = existingUser?._id;

  const result = (await Product.create(payload)).populate({
    path: 'seller',
  });

  return result;
};

const deleteProductService = async (productId: string, user: JwtPayload) => {
  const { ObjectId } = mongoose.Types;

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

  if (!new ObjectId(isProductExist.seller).equals(existingUser._id)) {
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
  const { ObjectId } = mongoose.Types;

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

  if (!new ObjectId(isProductExist.seller).equals(existingUser._id)) {
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
  const { searchTerm, price, ...filtersData } = filters;

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

  if (price) {
    andConditions.push({
      price: {
        $lte: Number(price),
      },
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
    .limit(limit)
    .populate('seller');

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
  const result = await Product.findById(payload).populate('seller');
  return result;
};

const bulkdeleteProductsService = async (
  productIds: string[],
  user: JwtPayload,
) => {
  const { ObjectId } = mongoose.Types;
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

    if (!new ObjectId(isProductExist.seller).equals(existingUser._id)) {
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

const getMyProductService = async (
  filters: TProductFilters,
  payload: IPaginationOptions,
  user: JwtPayload,
): Promise<IGenericResponse<TProduct[]>> => {
  const existingUser = await User.findOne({
    email: user?.email,
  });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Seller not found!');
  }

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

  andConditions.push({ seller: existingUser._id });

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
    .limit(limit)
    .populate('seller');

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

const getAllFiltersService = async () => {
  const categories = await Product.distinct('category');
  const interfaces = await Product.distinct('interface');
  const conditions = await Product.distinct('condition');
  const capacity = await Product.distinct('capacity');

  return { categories, interfaces, conditions, capacity };
};

export const ProductServices = {
  createProductService,
  deleteProductService,
  updateProductService,
  getAllProductService,
  getSingleProductService,
  bulkdeleteProductsService,
  getMyProductService,
  getAllFiltersService,
};
