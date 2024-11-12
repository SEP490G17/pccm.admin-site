import { UseToastOptions } from '@chakra-ui/react';

export const BookingMessage: Record<string, UseToastOptions> = {
  loadFailure: {
    title: 'Tải danh sách booking',
    description: 'Tải danh sách booking thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },
};

export const CourtClusterMessage: Record<string, UseToastOptions> = {
  loadDetailsFail: {
    title: 'Tải thông tin cụm sân',
    description: 'Tải thông tin  cụm sân thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },
};


export const CourtMessage: Record<string, UseToastOptions> = {
  loadCourtOfCourtClusterFail:{
    title: 'Tải danh sách sân',
    description: 'Tải danh sách sân của cụm sân thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  }
}