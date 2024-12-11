import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultStaffMessage = {
  update: {
    title: 'Cập nhật nhân viên',
    description: {
      success: 'Cập nhật nhân viên thành công',
      failure: 'Cập nhật nhân viên thất bại',
    },
  },

  loading: {
    title: 'Tải danh sách nhân viên',
    description: {
      failure: 'Tải danh sách nhân viên thất bại',
    },
  },

  create: {
    title: 'Thêm nhân viên',
    description: {
      failure: 'Thêm nhân viên thất bại',
      success: 'Thêm nhân viên thành công',
    },
  },

  detail: {
    title: 'Lấy chi tiết nhân viên',
    description: {
      failure: 'Lấy chi tiết nhân viên thất bại',
    },
  },

  delete: {
    title: 'Xóa nhân viên',
    description: {
      failure: 'Xóa nhân viên thất bại',
    },
  },
};

export const DefaultRoleMessage = {
  update: {
    title: 'Cập nhật chức vụ',
    description: {
      success: 'Cập nhật chức vụ thành công',
      failure: 'Cập nhật chức vụ thất bại',
    },
  },

  loading: {
    title: 'Tải danh sách chức vụ',
    description: {
      failure: 'Tải danh sách nhân viên thất bại',
    },
  },
};

export const StaffMessage = {
  loadingFailure: (
    title: string = DefaultStaffMessage.loading.title,
    description: string = DefaultStaffMessage.loading.description.failure,
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
    title: string = DefaultStaffMessage.create.title,
    description: string = DefaultStaffMessage.create.description.success,
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
    title: string = DefaultStaffMessage.create.title,
    description: string = DefaultStaffMessage.create.description.failure,
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
    title: string = DefaultStaffMessage.update.title,
    description: string = DefaultStaffMessage.update.description.success,
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
    title: string = DefaultStaffMessage.update.title,
    description: string,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  updateRoleSuccess: (
    title: string = DefaultRoleMessage.update.title,
    description: string = DefaultRoleMessage.update.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  updateRoleFailure: (
    title: string = DefaultRoleMessage.update.title,
    description: string,
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
    title: string = DefaultStaffMessage.detail.title,
    description: string = DefaultStaffMessage.detail.description.failure,
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
    title: string = DefaultStaffMessage.delete.title,
    description: string = DefaultStaffMessage.delete.description.failure,
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
