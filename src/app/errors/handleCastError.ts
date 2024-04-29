import mongoose from 'mongoose'
import { TErrorSource, TGenericErrorResponse } from '../interface/errors'

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400

  const errorSources: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ]

  return {
    statusCode,
    message: 'Invalid Id',
    errorSources,
  }
}

export default handleCastError
