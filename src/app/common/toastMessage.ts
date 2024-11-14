import { ToastProps } from '@chakra-ui/react';

export const BookingMessage: Record<string, ToastProps> = {
  loadFailure: {
    title: 'Tải danh sách booking',
    description: 'Tải danh sách booking thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },

  loadingPendingFailure: {
    title: 'Tải danh sách booking',
    description: 'Tải danh sách booking chờ duyệt thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },

  loadingCancelFailure: {
    title: 'Tải danh sách booking',
    description: 'Tải danh sách booking đã huỷ thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },

  getDetailFailure:{
    title: 'Tải chi tiết booking',
    description: 'Tải chi tiết booking thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  }
};

export const CourtClusterMessage: Record<string, ToastProps> = {
  loadDetailsFail: {
    title: 'Tải thông tin cụm sân',
    description: 'Tải thông tin  cụm sân thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },
};

export const CourtMessage: Record<string, ToastProps> = {
  loadCourtOfCourtClusterFail: {
    title: 'Tải danh sách sân',
    description: 'Tải danh sách sân của cụm sân thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },
};
