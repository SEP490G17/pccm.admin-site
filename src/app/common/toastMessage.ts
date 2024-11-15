import { UseToastOptions } from '@chakra-ui/react';

//#region default settings
export const DefaultSettingToast = {
  duration: 5000,
  isClosable: true,
};
//#endregion

//#region common message
export const CommonMessage = {
  loadingMessage: (title: string): UseToastOptions => ({
    title,
    description: 'Đang sử lý vui lòng đợi trong giây lát',
    status: 'loading',
  }),
};
export const PaymentMessage = {
  generating: (): UseToastOptions => ({
    title: 'Thanh toán',
    description: 'Đang khởi tạo thanh toán, vui lòng đợi ',
    status: 'loading',
  }),
  success: (): UseToastOptions => ({
    title: 'Thanh toán',
    description: 'Tạo thanh toán thành công',
    status: 'success',
    duration: 5000,
    isClosable: true,
  }),
  failure: (description: string = 'Tạo thanh toán thất bại'): UseToastOptions => ({
    title: 'Thanh toán',
    description,
    status: 'error',
    duration: 5000,
    isClosable: true,
  }),
};

//#endregion


// #region Booking message
export const DefaultBookingText = {
  title: {
    loading: 'Tải danh sách booking',
    details: 'Tải chi tiết booking',
    accept: 'Xác thực đặt lịch ',
  },
  description: {
    failure: {
      loading: 'Tải danh sách booking thất bại',
      loadingPending: 'Tải danh sách booking chờ duyệt thất bại',
      loadingCancel: 'Tải danh sách booking đã huỷ thất bại',
      getDetails: 'Tải chi tiết booking thất bại',
    },
    success: {
      accept: 'Xác thực đặt lịch thành công',
    },
  },
};



export const BookingMessage = {
  loadFailure: (
    title: string = DefaultBookingText.title.loading,
    description: string = DefaultBookingText.description.failure.loading,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  loadPendingFailure: (
    title: string = DefaultBookingText.title.loading,
    description: string = DefaultBookingText.description.failure.loadingPending,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  loadCancelFailure: (
    title: string = DefaultBookingText.title.loading,
    description: string = DefaultBookingText.description.failure.loadingCancel,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  getDetailFailure: (
    title: string = DefaultBookingText.title.loading,
    description: string = DefaultBookingText.description.failure.getDetails,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),

  acceptFailure: (
    title: string = DefaultBookingText.title.accept,
    description: string,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'error',
    duration,
    isClosable,
  }),
  acceptSuccess: (
    title: string = DefaultBookingText.title.accept,
    description: string = DefaultBookingText.description.success.accept,
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



//#endregion

export const DefaultOrderText = {
  title: {
    create:'Tạo Order'
  },

  description: {
    success:{
      create: 'Tạo đơn hàng thành công',
    },
    failure: {
      create: 'Tạo đơn hàng thất bại',
    },

  }
}

export const OrderMessage = {
  createSuccess: (
    title: string = DefaultOrderText.title.create,
    description: string = DefaultOrderText.description.success.create,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),
  createFailure: (
    title: string = DefaultOrderText.title.create,
    description: string = DefaultOrderText.description.failure.create,
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
  loadCourtOfCourtClusterFail: {
    title: 'Tải danh sách sân',
    description: 'Tải danh sách sân của cụm sân thất bại',
    status: 'error',
    duration: 5000,
    isClosable: true,
  },
};
