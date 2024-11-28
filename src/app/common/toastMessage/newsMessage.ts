import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultNewsMessage = {
  update: {
    title: 'Chỉnh sửa tin tức',
    description: {
      success: 'Chỉnh sửa tin tức thành công',
      failure: 'Chỉnh sửa tin tức thất bại',
    },
  },

  loading: {
    title: 'Tải danh sách tin tức',
    description: {
      failure: 'Tải danh sách tin tức thất bại',
    },
  },

  create: {
    title: 'Tạo tin tức',
    description: {
      failure: 'Tạo tin tức thất bại',
      success: 'Tạo tin tức thành côngz',
    },
  },

  detail: {
    title: 'Lấy chi tiết tin tức',
    description: {
      failure: 'Lấy chi tiết tin tức thất bại',
    },
  },

  delete: {
    title: 'Xóa tin tức',
    description: {
      failure: 'Xóa tin tức thất bại',
      success: 'Xóa tin tức thành công',
    },
  },
};

export const NewsMessage = {
  loadingFailure: (
    title: string = DefaultNewsMessage.loading.title,
    description: string = DefaultNewsMessage.loading.description.failure,
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
    title: string = DefaultNewsMessage.create.title,
    description: string = DefaultNewsMessage.create.description.success,
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
    title: string = DefaultNewsMessage.create.title,
    description: string = DefaultNewsMessage.create.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  updateSuccess: (
    title: string = DefaultNewsMessage.update.title,
    description: string = DefaultNewsMessage.update.description.success,
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
    title: string = DefaultNewsMessage.update.title,
    description: string = DefaultNewsMessage.update.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  detailFailure: (
    title: string = DefaultNewsMessage.detail.title,
    description: string = DefaultNewsMessage.detail.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  deleteFailure: (
    title: string = DefaultNewsMessage.delete.title,
    description: string = DefaultNewsMessage.delete.description.failure,
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
    title: string = DefaultNewsMessage.delete.title,
    description: string = DefaultNewsMessage.delete.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),
};
