import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultServiceLogsMessage = {
  loading: {
    title: 'Tải danh sách logs dịch vụ',
    description: {
      failure: 'Tải danh sách logs dịch vụ bại',
    },
  },
};

export const ServiceLogsMessage = {
  loadingFailure: (
    title: string = DefaultServiceLogsMessage.loading.title,
    description: string = DefaultServiceLogsMessage.loading.description.failure,
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
