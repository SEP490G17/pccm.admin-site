import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultCourtClusterText = {
  loadDetails: {
    title: 'Tải thông tin cụm sân',
    descriptions: {
      failure: 'Tải thông tin  cụm sân thất bại',
    },
  },
  edit: {
    title: 'Sửa thông tin cụm sân',
    descriptions: {
      failure: 'Sửa thông tin  cụm sân thất bại',
      success: 'Sửa thông tin  cụm sân thành công',
    },
  },
  delete: {
    title: 'Xóa cụm sân',
    descriptions: {
      failure: 'Xóa cụm sân thất bại',
      success: 'Xóa cụm sân thành công',
    },
  },

  visible: {
    title: 'Hiển thị sân',
    descriptions: {
      failure: 'Update hiển thị sân thất bại',
      success: 'Update hiển thị sân thành công',
    },
  },
};

export const CourtClusterMessage = {
  loadDetailsFail: (
    title: string = DefaultCourtClusterText.loadDetails.title,
    description: string = DefaultCourtClusterText.loadDetails.descriptions.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),
  editSuccess: (
    title: string = DefaultCourtClusterText.edit.title,
    description: string = DefaultCourtClusterText.edit.descriptions.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),
  editFailure: (
    title: string = DefaultCourtClusterText.edit.title,
    description: string = DefaultCourtClusterText.edit.descriptions.failure,
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
    title: string = DefaultCourtClusterText.delete.title,
    description: string = DefaultCourtClusterText.delete.descriptions.success,
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
    title: string = DefaultCourtClusterText.delete.title,
    description: string = DefaultCourtClusterText.delete.descriptions.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  visibleSuccess: (
    title: string = DefaultCourtClusterText.visible.title,
    description: string = DefaultCourtClusterText.visible.descriptions.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status:'success',
    duration,
    isClosable,
  }),

  visibleFailure: (
    title: string = DefaultCourtClusterText.visible.title,
    description: string = DefaultCourtClusterText.visible.descriptions.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status:'error',
    duration,
    isClosable,
  }),
};
