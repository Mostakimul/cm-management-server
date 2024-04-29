/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import config from '../config'
import AppError from '../errors/AppError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'
import handleValidationError from '../errors/handleValidationError'
import handleZodError from '../errors/handleZodError'
import { TErrorSource } from '../interface/errors'

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ]

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (error?.code === 11000) {
    const simplifiedError = handleDuplicateError(error)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode
    message = error?.message
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ]
  } else if (error instanceof Error) {
    message = error?.message
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ]
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? error?.stack : null,
  })
}

export default globalErrorHandler
