/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from '../interface/errors'

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 400

  const match = err.message.match(/"([^"]*)"/)

  const extractedMessage = match && match[1]

  const errorSources: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ]

  return {
    statusCode,
    message: 'Duplicate Error',
    errorSources,
  }
}

export default handleDuplicateError
