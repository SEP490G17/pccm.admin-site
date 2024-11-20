import { UseToastOptions } from '@chakra-ui/react';

export const CourtClusterMessage: Record<string, UseToastOptions> = {
  loadDetailsFail: {
    title: 'Tải thông tin cụm sân',
    description: 'Tải thông tin  cụm sân thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },
};


