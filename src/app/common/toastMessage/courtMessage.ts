import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultCourtText = {
  loadCourtCluster: {
    title: 'Tải danh sách sân thuộc cụm',
    description: {
      failure: 'Tải danh sách sân thất bại, có lỗi phát sinh',
    },
  },
  updateCourtPrice: {
    title: 'Cập nhật giá sân',
    description: {
      success: 'Cập nhật giá sân thành công',
      failure: 'Cập nhật giá sân thất bại, có lỗi phát sinh',
    },
  },

  removeCourt: {
    title: 'Xóa sân',
    description: {
      success: 'Xóa sân thành công',
      failure: 'Xóa sân thất bại, có lỗi phát sinh',
    },
  },

  toggleCourt: {
    title: 'Cập nhật trạng thái',
    description: {
      failure: 'Cập nhật trạng thái thất bại',
    },
  },
};

export const CourtMessage = {
  loadCourtClusterFailure: (
    title: string = DefaultCourtText.loadCourtCluster.title,
    description: string = DefaultCourtText.loadCourtCluster.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  updateCourtPricesFailure: (
    title: string = DefaultCourtText.updateCourtPrice.title,
    description: string = DefaultCourtText.updateCourtPrice.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  updateCourtPricesSuccess: (
    title: string = DefaultCourtText.updateCourtPrice.title,
    description: string = DefaultCourtText.updateCourtPrice.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  removeCourtFailure: (
    title: string = DefaultCourtText.removeCourt.title,
    description: string = DefaultCourtText.removeCourt.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  removeCourtSuccess: (
    title: string = DefaultCourtText.removeCourt.title,
    description: string = DefaultCourtText.removeCourt.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  toggleCourtFailure: (
    title: string = DefaultCourtText.toggleCourt.title,
    description: string = DefaultCourtText.toggleCourt.description.failure,
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