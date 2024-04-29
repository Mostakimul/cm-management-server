import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ServicingServices } from './servicing.service';

const createServicing = catchAsync(async (req, res) => {
  const result = await ServicingServices.createServicingService(
    req.body,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Servicing request placed successfully',
    data: result,
  });
});

export const ServicingController = {
  createServicing,
};
