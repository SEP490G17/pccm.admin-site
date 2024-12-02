import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultOrderText = {
  title: {
    save: 'Tạo Order',
    cancel: 'Hủy Order',
    payment: 'Xác thực thanh toán',
  },

  description: {
    success: {
      create: 'Lưu đơn hàng thành công',
      cancel: 'Hủy đơn hàng thành công',
      payment: 'Xác thực thanh toàn thành công',
    },
    failure: {
      create: 'Lưu đơn hàng thất bại',
      cancel: 'Hủy đơn thất bại',
      payment: 'Xác thực thanh toán thất bại',
    },
  },
};

export const OrderMessage = {
  createSuccess: (
    title: string = DefaultOrderText.title.save,
    description: string = DefaultOrderText.description.success.create,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  createFailure: (
    description: string = DefaultOrderText.description.failure.create,
    title: string = DefaultOrderText.title.save,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  cancelSuccess: (
    description: string = DefaultOrderText.description.success.cancel,
    title: string = DefaultOrderText.title.cancel,
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
    description: string = DefaultOrderText.description.failure.cancel,
    title: string = DefaultOrderText.title.cancel,
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
    description: string = DefaultOrderText.description.success.payment,
    title: string = DefaultOrderText.title.payment,
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
    description: string = DefaultOrderText.description.failure.payment,
    title: string = DefaultOrderText.title.payment,
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
