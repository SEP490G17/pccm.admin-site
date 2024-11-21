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
};
