import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultBannerMessage = {
  update: {
    title: 'Chỉnh sửa banner',
    description: {
      success: 'Chỉnh sửa banner thành công',
      failure: 'Chỉnh sửa banner thất bại',
    },
  },

  loading: {
    title: 'Tải danh sách banner',
    description: {
      failure: 'Tải danh sách banner thất bại',
    },
  },

  create: {
    title: 'Tạo banner',
    description: {
      failure: 'Tạo banner thất bại',
      success: 'Tạo banner thành côngz',
    },
  },

  detail: {
    title: 'Lấy chi tiết banner',
    description: {
      failure: 'Lấy chi tiết banner thất bại',
    },
  },
};

export const BannerMessage = {
  loadingFailure: (
    title: string = DefaultBannerMessage.loading.title,
    description: string = DefaultBannerMessage.loading.description.failure,
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
    title: string = DefaultBannerMessage.create.title,
    description: string = DefaultBannerMessage.create.description.success,
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
    title: string = DefaultBannerMessage.create.title,
    description: string = DefaultBannerMessage.create.description.failure,
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
    title: string = DefaultBannerMessage.update.title,
    description: string = DefaultBannerMessage.update.description.success,
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
    title: string = DefaultBannerMessage.update.title,
    description: string = DefaultBannerMessage.update.description.success,
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
    title: string = DefaultBannerMessage.detail.title,
    description: string = DefaultBannerMessage.detail.description.failure,
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
