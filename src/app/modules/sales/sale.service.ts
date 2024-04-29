import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import AppError from '../../errors/AppError';
import { IGenericResponse, IPaginationOptions } from '../../interface/common';
import { Product } from '../product/product.model';
import { SALE_SEARCHABLE } from './sale.constant';
import { TSale, TSaleFilters } from './sale.interface';
import { Sale } from './sale.model';

const createSaleService = async (payload: TSale) => {
  const { productId, quantity, buyerName, date } = payload;

  const isProductExist = await Product.findById(productId);
  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  if (quantity > isProductExist.quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Do not have enough inventory!');
  }

  let newSaleData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update prduct quantity
    const updateProduct = await Product.findOneAndUpdate(
      { _id: productId },
      {
        quantity,
      },
      { session },
    );

    if (!updateProduct) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update quantity!');
    }

    const saleData = {
      productId,
      quantity,
      buyerName,
      date,
      totalAmount: quantity * isProductExist.price,
    };

    const result = await Sale.create([saleData], { session });

    if (!result.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to make sale');
    }

    newSaleData = result[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newSaleData) {
    newSaleData = await Sale.findOne({ _id: newSaleData.id }).populate({
      path: 'productId',
    });
  }

  return newSaleData;
};

const getAllSaleService = async (
  filters: TSaleFilters,
  payload: IPaginationOptions,
): Promise<IGenericResponse<TSale[]>> => {
  const { searchTerm, timeFrame, ...filtersData } = filters;

  const today = new Date();

  let startTime;
  let endTime;

  if (timeFrame === 'daily') {
    startTime = today.setHours(0, 0, 0, 0);
    endTime = new Date(today);
    endTime.setDate(endTime.getDate() + 1);
  } else if (timeFrame === 'weekly') {
    startTime = new Date(today.setDate(today.getDate() - today.getDay()));
    endTime = new Date(today.setDate(today.getDate() + 7));
  } else if (timeFrame === 'monthly') {
    startTime = new Date(today.getFullYear(), today.getMonth(), 1);
    endTime = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (timeFrame === 'yearly') {
    startTime = new Date(today.getFullYear(), 0, 1);
    endTime = new Date(today.getFullYear() + 1, 0, 0);
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(payload);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: SALE_SEARCHABLE.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (timeFrame) {
    andConditions.push({
      date: {
        $gte: startTime,
        $lte: endTime,
      },
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

  const result = await Sale.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Sale.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const SaleServices = {
  createSaleService,
  getAllSaleService,
};
