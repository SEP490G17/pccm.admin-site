import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultCategoryMessage = {
  update: {
    title: 'Chỉnh sửa thể loại',
    description: {
      success: 'Chỉnh sửa thể loại thành công',
      failure: 'Chỉnh sửa thể loại thất bại',
    },
  },

  loading: {
    title: 'Tải danh sách thể loại',
    description: {
      failure: 'Tải danh sách thể loại thất bại',
    },
  },

  create: {
    title: 'Tạo thể loại',
    description: {
      failure: 'Tạo thể loại thất bại',
      success: 'Tạo thể loại thành công',
    },
  },

  delete: {
    title: 'Xóa thể loại',
    description: {
      failure: 'Xóa thể loại thất bại. Bạn cần xóa các sản phẩm có thể loại này trước!',
      success: 'Xóa thể loại thành công',
    },
  },
};

export const CategoryMessage = {
  loadingFailure: (
    title: string = DefaultCategoryMessage.loading.title,
    description: string = DefaultCategoryMessage.loading.description.failure,
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
    title: string = DefaultCategoryMessage.create.title,
    description: string = DefaultCategoryMessage.create.description.success,
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
    title: string = DefaultCategoryMessage.create.title,
    description: string = DefaultCategoryMessage.create.description.failure,
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
    title: string = DefaultCategoryMessage.update.title,
    description: string = DefaultCategoryMessage.update.description.success,
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
    title: string = DefaultCategoryMessage.update.title,
    description: string = DefaultCategoryMessage.update.description.success,
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
    title: string = DefaultCategoryMessage.delete.title,
    description: string = DefaultCategoryMessage.delete.description.failure,
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
    title: string = DefaultCategoryMessage.delete.title,
    description: string = DefaultCategoryMessage.delete.description.success,
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
