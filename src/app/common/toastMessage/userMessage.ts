import { UseToastOptions } from '@chakra-ui/react';
import { DefaultSettingToast } from './commonMessage';

export const DefaultUserMessage = {
  status: {
    title: 'Chỉnh sửa trang thai nguoi dung',
    description: {
      failure: 'Chỉnh sửa trang thai nguoi dung that bai',
    },
  },


};

export const UserMessage = {


  statusFailure: (
    title: string = DefaultUserMessage.status.title,
    description: string = DefaultUserMessage.status.description.failure,
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
