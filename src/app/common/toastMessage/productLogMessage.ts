import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultProductLogsMessage = {
  loading: {
    title: 'Tải danh sách logs hàng hóa',
    description: {
      failure: 'Tải danh sách logs hàng hóa thất bại',
    },
  },
};

export const ProductLogsMessage = {
  loadingFailure: (
    title: string = DefaultProductLogsMessage.loading.title,
    description: string = DefaultProductLogsMessage.loading.description.failure,
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
