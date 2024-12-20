import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

// #region Booking message
export const DefaultBookingText = {
  loading: {
    title: 'Tải danh sách booking',
    description: {
      loadingFailure: 'Tải danh sách booking thất bại',
      loadingPendingFailure: 'Tải danh sách booking chờ duyệt thất bại',
      loadingCancelFailuer: 'Tải danh sách booking đã huỷ thất bại',
    },
  },

  details: {
    title: 'Tải chi tiết booking',
    description: {
      failure: 'Tải chi tiết booking thất bại',
    },
  },

  accept: {
    title: 'Xác thực đặt lịch',
    description: {
      success: 'Xác thực đặt lịch thành công',
      failure: 'Xác thực đặt lịch thất bại, có lỗi phát sinh',
    },
  },

  cancel: {
    title: 'Huỷ lịch đặt sân',
    description: {
      success: 'Huỷ lịch thành công',
      failure: 'Huỷ lịch thất bại',
    },
  },

  deny: {
    title: 'Từ chối lịch đặt',
    description: {
      success: 'Từ chối lịch thành công',
      failure: 'Từ chối lịch thất bại',
    },
  },

  complete: {
    title: 'Xác nhận lịch hoàn thành',
    description: { success: 'Xác nhận lịch hoàn thành thành công' },
  },

  booking: {
    title: 'Đặt lịch',
    description: {
      success: 'Đặt lịch thành công',
    },
  },

  payment: {
    title: 'Xác thực thanh toán',
    description: {
      success: 'Xác thực thanh toán thành công',
    },
  },

  getConflig: {
    title: 'Lấy danh sách các lịch trùng',
    description: {
      failure: 'Lấy danh sách các lịch trùng thất bại',
    },
  },
};

export const BookingMessage = {
  loadFailure: (
    title: string = DefaultBookingText.loading.title,
    description: string = DefaultBookingText.loading.description.loadingFailure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  loadPendingFailure: (
    title: string = DefaultBookingText.loading.title,
    description: string = DefaultBookingText.loading.description.loadingCancelFailuer,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  loadDenyFailure: (
    title: string = DefaultBookingText.loading.title,
    description: string = DefaultBookingText.loading.description.loadingCancelFailuer,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  getDetailFailure: (
    title: string = DefaultBookingText.details.title,
    description: string = DefaultBookingText.details.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  acceptFailure: (
    description: string = DefaultBookingText.accept.description.failure,
    title: string = DefaultBookingText.accept.title,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  acceptSuccess: (
    title: string = DefaultBookingText.accept.title,
    description: string = DefaultBookingText.accept.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  cancelSuccess: (
    title: string = DefaultBookingText.cancel.title,
    description: string = DefaultBookingText.cancel.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  cancelFailure: (
    description: string = DefaultBookingText.cancel.description.failure,
    title: string = DefaultBookingText.cancel.title,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),
  completeSuccess: (
    title: string = DefaultBookingText.complete.title,
    description: string = DefaultBookingText.complete.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  completeFailure: (
    description: string,
    title: string = DefaultBookingText.complete.title,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  denySuccess: (
    title: string = DefaultBookingText.deny.title,
    description: string = DefaultBookingText.deny.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),
  
  denyFailure: (
    title: string = DefaultBookingText.deny.title,
    description: string = DefaultBookingText.deny.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  bookingSuccess: (
    title: string = DefaultBookingText.booking.title,
    description: string = DefaultBookingText.booking.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  bookingFailure: (
    description: string,
    title: string = DefaultBookingText.booking.title,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  paymentSuccess: (
    description: string = DefaultBookingText.payment.description.success,
    title: string = DefaultBookingText.booking.title,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  paymentFailure: (
    description: string,
    title: string = DefaultBookingText.booking.title,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  getConfligFailure: (
    description: string = DefaultBookingText.getConflig.description.failure,
    title: string = DefaultBookingText.getConflig.title,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),
};

//#endregion
