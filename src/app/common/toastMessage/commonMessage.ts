import { UseToastOptions } from "@chakra-ui/react";

export const DefaultSettingToast = {
    duration: 5000,
    isClosable: true,
  };

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