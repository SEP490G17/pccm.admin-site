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
};
