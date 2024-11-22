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

  courtCombo: {
    title: 'Cập nhật combo sân',
    description: {
      success: 'Cập nhật combo sân thành công',
      failure: 'Cập nhật combo sân thất bại',
    },
  },

  createCourt: {
    title: 'Thêm sân',
    description: {
      success: 'Thêm sân thành công',
      failure: 'Thêm sân thất bại',
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

  updateCourtCombosSuccess: (
    title: string = DefaultCourtText.courtCombo.title,
    description: string = DefaultCourtText.courtCombo.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  updateCourtCombosFailure: (
    title: string = DefaultCourtText.courtCombo.title,
    description: string = DefaultCourtText.courtCombo.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  createCourtFailure: (
    title: string = DefaultCourtText.createCourt.title,
    description: string = DefaultCourtText.createCourt.description.failure,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  createCourtSuccess: (
    title: string = DefaultCourtText.createCourt.title,
    description: string = DefaultCourtText.createCourt.description.success,
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
