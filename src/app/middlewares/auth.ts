import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import AppError from '../errors/AppError'
import { TUserRole } from '../modules/user/user.interface'
import { User } from '../modules/user/user.model'
import { checkUserStatus } from '../modules/user/user.utils'
import catchAsync from '../utils/catchAsync'

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    // checking if the given token is valid
    let decoded
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    const { role, userId, iat } = decoded

    const user = await checkUserStatus(userId)

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    req.user = decoded as JwtPayload
    next()
  })
}

export default auth
