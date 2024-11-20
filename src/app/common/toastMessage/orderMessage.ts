import { UseToastOptions } from "@chakra-ui/react";
import { DefaultSettingToast } from "./commonMessage";

export const DefaultOrderText = {
  title: {
    create: 'Tạo Order',
  },

  description: {
    success: {
      create: 'Tạo đơn hàng thành công',
    },
    failure: {
      create: 'Tạo đơn hàng thất bại',
    },
  },
};

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
