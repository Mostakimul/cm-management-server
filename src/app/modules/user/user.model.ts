/* eslint-disable @typescript-eslint/no-this-alias */

import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { USER_ROLE } from './user.constant';
import { TUser, UserModel } from './user.interface';

const userSchema = new Schema<TUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: [USER_ROLE.admin, USER_ROLE.buyer, USER_ROLE.seller],
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// creating a post hook // will work on create() and save()
userSchema.pre('save', async function (next) {
  const user = this;
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// is user exist
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

// is password match
userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
