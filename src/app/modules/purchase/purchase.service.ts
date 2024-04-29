import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { TPurchase } from './purchase.interface';
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

// const getAllSaleService = async (
//   filters: TSaleFilters,
//   payload: IPaginationOptions,
//   user: JwtPayload,
// ): Promise<IGenericResponse<TSale[]>> => {
//   const { searchTerm, timeFrame, ...filtersData } = filters;

//   const existingUser = await User.findOne({
//     email: user?.email,
//   });
//   if (!existingUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
//   }

//   if (existingUser.role === USER_ROLE.buyer) {
//     throw new AppError(
//       httpStatus.UNAUTHORIZED,
//       'You do not have sales history, because you are buyer!',
//     );
//   }

//   const today = new Date();

//   let startTime;
//   let endTime;

//   if (timeFrame === 'daily') {
//     startTime = today.setHours(0, 0, 0, 0);
//     endTime = new Date(today);
//     endTime.setDate(endTime.getDate() + 1);
//   } else if (timeFrame === 'weekly') {
//     startTime = new Date(today.setDate(today.getDate() - today.getDay()));
//     endTime = new Date(today.setDate(today.getDate() + 7));
//   } else if (timeFrame === 'monthly') {
//     startTime = new Date(today.getFullYear(), today.getMonth(), 1);
//     endTime = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//   } else if (timeFrame === 'yearly') {
//     startTime = new Date(today.getFullYear(), 0, 1);
//     endTime = new Date(today.getFullYear() + 1, 0, 0);
//   }

//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(payload);

//   const andConditions = [];

//   if (searchTerm) {
//     andConditions.push({
//       $or: SALE_SEARCHABLE.map((field) => ({
//         [field]: { $regex: searchTerm, $options: 'i' },
//       })),
//     });
//   }

//   if (existingUser.role === USER_ROLE.seller) {
//     andConditions.push({
//       seller: existingUser._id,
//     });
//   }

//   if (timeFrame) {
//     andConditions.push({
//       date: {
//         $gte: startTime,
//         $lte: endTime,
//       },
//     });
//   }

//   if (Object.keys(filtersData).length) {
//     andConditions.push({
//       $and: Object.entries(filtersData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   const sortConditions: { [key: string]: SortOrder } = {};
//   if (sortBy && sortOrder) {
//     sortConditions[sortBy] = sortOrder;
//   }

//   const whereConditions =
//     andConditions.length > 0 ? { $and: andConditions } : {};

//   const result = await Sale.find(whereConditions)
//     .sort(sortConditions)
//     .skip(skip)
//     .limit(limit)
//     .populate('seller')
//     .populate('productId');

//   const total = await Sale.countDocuments(whereConditions);

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

export const PurchaseServices = {
  createPurchaseService,
};
