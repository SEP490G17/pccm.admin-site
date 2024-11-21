import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultProductMessageText = {
  update: {
    title: 'Chỉnh sửa hàng hoá',
    description: {
      success: 'Chỉnh sửa hàng hoá thành công',
      failure: 'Chỉnh sửa hàng hoá thất bại',
    },
  },

  delete: {
    title: 'Xoá hàng hoá',
    description: {
      success: 'Xoá hàng hoá thành công',
      failure: 'Xoá hàng hoá thất bại',
    },
  },

  create: {
    title: 'Thêm hàng hoá',
    description: {
      success: 'Thêm hàng hoá thành công',
      failure: 'Thêm hàng hoá thất bại',
    },
  },
};

export const ProductMessage = {
  updateSuccess: (
    title: string = DefaultProductMessageText.update.title,
    description: string = DefaultProductMessageText.update.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  updateFailure: (
    title: string = DefaultProductMessageText.update.title,
    description: string = DefaultProductMessageText.update.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  createSuccess: (
    title: string = DefaultProductMessageText.create.title,
    description: string = DefaultProductMessageText.create.description.success,
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
    title: string = DefaultProductMessageText.create.title,
    description: string = DefaultProductMessageText.create.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  deleteSuccess: (
    title: string = DefaultProductMessageText.delete.title,
    description: string = DefaultProductMessageText.delete.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  deleteFailure: (
    title: string = DefaultProductMessageText.delete.title,
    description: string = DefaultProductMessageText.delete.description.failure,
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
