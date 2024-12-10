import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultUserMessage = {
  status: {
    title: 'Cập nhật thông tin người dùng',
    description: {
      success: 'Cập nhật thông tin người dùng thành công',
    },
  },

  statusChange:{
    title: 'Cập nhật trạng thái người dùng',
    description: {
      success: 'Cập nhật trạng thái người dùng thành công',
      failure: 'Cập nhật trạng thái người dùng thất bại'
    },
  }
};

export const ChangePasswordMessage = {
  status: {
    title: 'Đổi mật khẩu',
    description: {
      success: 'Thay đổi mật khẩu thành công',
    },
  },
};

export const UserMessage = {
  updateProfileSuccess: (
    title: string = DefaultUserMessage.status.title,
    description: string = DefaultUserMessage.status.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  updateProfileFailure: (
    title: string = DefaultUserMessage.status.title,
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

  changePasswordSuccess: (
    title: string = ChangePasswordMessage.status.title,
    description: string = ChangePasswordMessage.status.description.success,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  changePasswordFailure: (
    title: string = ChangePasswordMessage.status.title,
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


  statusChangeSuccess: (
    description:string= DefaultUserMessage.statusChange.description.success,
    title: string = DefaultUserMessage.statusChange.title,
    duration: number = DefaultSettingToast.duration,
    isClosable: boolean = DefaultSettingToast.isClosable,
  ): UseToastOptions => ({
    title,
    description,
    status: 'success',
    duration,
    isClosable,
  }),

  statusChangeFailure: (
    description:string= DefaultUserMessage.statusChange.description.failure,
    title: string = DefaultUserMessage.statusChange.title,
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
