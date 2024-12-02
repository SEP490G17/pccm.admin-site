import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultServiceText = {
  update: {
    title: 'Chỉnh sửa dịch vụ',
    description: {
      success: 'Chỉnh sửa dịch vụ thành công',
      failure: 'Chỉnh sửa dịch vụ thất bại',
    },
  },
  loading: {
    title: 'Tải danh sách dịch vụ',
    description: {
      success: 'Tải danh sách dịch vụ thành công',
      failure: 'Tải danh sách dịch vụ thất bại',
    },
  },

  create: {
    title: 'Thêm dịch vụ',
    description: {
      success: 'Thêm dịch vụ thành công',
      failure: 'Thêm dịch vụ thất bại',
    },
  },

  delete: {
    title: 'Xoá dịch vụ',
    description: {
      success: 'Xoá dịch vụ thành công',
      failure: 'Xoá dịch vụ thất bại',
    },
  },

  detail: {
    title: 'Tải chi tiết dịch vụ',
    description: {
      failure: 'Tải chi tiết dịch vụ thất bại',
    },
  },
};

export const ServiceMessage = {
  updateSuccess: (
    title: string = DefaultServiceText.update.title,
    description: string = DefaultServiceText.update.description.success,
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
    title: string = DefaultServiceText.update.title,
    description: string = DefaultServiceText.update.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  loadSuccess: (
    title: string = DefaultServiceText.loading.title,
    description: string = DefaultServiceText.loading.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  loadFailure: (
    title: string = DefaultServiceText.loading.title,
    description: string = DefaultServiceText.loading.description.failure,
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
    title: string = DefaultServiceText.delete.title,
    description: string = DefaultServiceText.delete.description.success,
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
    title: string = DefaultServiceText.delete.title,
    description: string = DefaultServiceText.delete.description.failure,
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
    title: string = DefaultServiceText.create.title,
    description: string = DefaultServiceText.create.description.success,
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
    description: string = DefaultServiceText.create.description.failure,
    title: string = DefaultServiceText.create.title,
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
