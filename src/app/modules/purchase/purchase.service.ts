import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import AppError from '../../errors/AppError';
import { IGenericResponse, IPaginationOptions } from '../../interface/common';
import { Product } from '../product/product.model';
import { USER_ROLE } from '../user/user.constant';
import { User } from '../user/user.model';
import { PURCHASE_SEARCHABLE } from './purchase.constant';
import { TPurchase, TPurchaseFilters } from './purchase.interface';
import { Purchase } from './purchase.model';

const createPurchaseService = async (payload: TPurchase, user: JwtPayload) => {
  const existingUser = await User.findOne({
    email: user?.email,
  });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Buyer not found!');
  }

  const { product, quantity, purchaseDate } = payload;

  const isProductExist = await Product.findById(product);
  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  if (quantity > isProductExist.quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Do not have enough inventory!');
  }

  let newPurchaseData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update prduct quantity
    const updateProduct = await Product.findOneAndUpdate(
      { _id: product },
      {
        quantity: isProductExist.quantity - quantity,
      },
      { session },
    );

    if (!updateProduct) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update quantity!');
    }

    const purchaseData = {
      product,
      buyer: existingUser._id,
      seller: isProductExist.seller,
      quantity,
      purchaseDate,
      totalAmount: quantity * isProductExist.price,
    };

    const result = await Purchase.create([purchaseData], { session });

    if (!result.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to purchase!');
    }

    newPurchaseData = result[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newPurchaseData) {
    newPurchaseData = await Purchase.findOne({ _id: newPurchaseData._id })
      .populate('product')
      .populate('seller')
      .populate('buyer');
  }

  return newPurchaseData;
};

const getAllPurchaseService = async (
  filters: TPurchaseFilters,
  payload: IPaginationOptions,
  user: JwtPayload,
): Promise<IGenericResponse<TPurchase[]>> => {
  const { searchTerm, timeFrame, ...filtersData } = filters;

  console.log(timeFrame);

  const existingUser = await User.findOne({
    email: user?.email,
  });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (existingUser.role === USER_ROLE.seller) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You do not have purchase history, because you are seller!',
    );
  }

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
      $or: PURCHASE_SEARCHABLE.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (existingUser.role === USER_ROLE.buyer) {
    andConditions.push({
      buyer: existingUser._id,
    });
  }

  if (timeFrame) {
    andConditions.push({
      purchaseDate: {
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

  const result = await Purchase.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('seller')
    .populate('product')
    .populate('buyer');

  const total = await Purchase.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const PurchaseServices = {
  createPurchaseService,
  getAllPurchaseService,
};
