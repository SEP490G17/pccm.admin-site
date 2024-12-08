import { makeAutoObservable, runInAction } from 'mobx';
import {
  ChangePasswordInput,
  ConfirmForgotPasswordDto,
  RegisterDto,
  UpdateProfileDto,
} from '../models/account.model';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { Profile } from '../models/user.model';
import { store } from './store';
import { catchErrorHandle } from '../helper/utils';
import { UserMessage } from '../common/toastMessage/userMessage';
import { CreateToastFnReturn } from '@chakra-ui/react';

export default class AccountStore {
  loadingRegister: boolean = false;
  loadingUpdate: boolean = false;
  loadingProfile: boolean = false;
  loadingForgotPassword: boolean = false;
  loadingConfirmPassword: boolean = false;
  profileData: Profile | undefined = undefined;
  loadingChangePassword: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  register = async (value: RegisterDto) => {
    this.loadingRegister = true;
    const [err, res] = await catchErrorHandle(agent.Account.register(value));
    runInAction(() => {
      this.loadingRegister = false;
    });
    return { err, res };
  };

  profile = async () => {
    this.loadingProfile = true;
    await agent.Account.profile()
      .then((data) => (this.profileData = data))
      .catch((error: any) => toast.error(error[0]))
      .finally(() => (this.loadingProfile = false));
  };

  updateProfile = async (data: UpdateProfileDto, toast: CreateToastFnReturn) => {
    this.loadingUpdate = true;
    const [err, res] = await catchErrorHandle(agent.Account.updateProfile(data));
    runInAction(() => {
      if (res) {
        store.authStore.getUser();
        toast(UserMessage.updateProfileSuccess());
      }
      if (err) {
        toast(UserMessage.updateProfileFailure(undefined, err));
      }
    });
    this.loadingUpdate = false;
    return { err, res };
  };

  forgotPassword = async (email: string) => {
    this.loadingForgotPassword = true;
    const [err, res] = await catchErrorHandle(agent.Account.forgotPassword(email));
    runInAction(() => {
      this.loadingForgotPassword = false;
    });
    if (res) {
      toast.success('Email đặt lại mật khẩu đã được gửi');
    }
    return { err, res };
  };

  confirmForgotPassword = async (token: string, newPassword: string) => {
    this.loadingConfirmPassword = true;
    const data = new ConfirmForgotPasswordDto({ token, newPassword });
    await agent.Account.confirmForgotPassword(data)
      .then(() => toast.success('Mật khẩu đã được thay đổi thành công'))
      .catch((error: any) => toast.error(error[0]))
      .finally(() => (this.loadingConfirmPassword = false));
  };

  changePassword = async (value: ChangePasswordInput, toast: CreateToastFnReturn) => {
    this.loadingChangePassword = true;
    const [err, res] = await catchErrorHandle(agent.Account.changePassword(value));
    runInAction(() => {
      if (err) {
        toast(UserMessage.changePasswordFailure(undefined, err.response.data));
      }
      if (res) {
        toast(UserMessage.changePasswordSuccess());
      }
    });
    this.loadingChangePassword = false;
    if (err) return false;
    if (res) return true;
  };
}
