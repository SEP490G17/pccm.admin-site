import { PaymentType } from './../models/payment.model';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import { PaymentMessage } from '../common/toastMessage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { CreateToastFnReturn } from '@chakra-ui/react';

dayjs.extend(utc);
dayjs.extend(timezone);

export default class PaymentStore {
  loadingPayment: boolean = false;
  paymentUrl: string = '';
  constructor() {
    makeAutoObservable(this);
  }
  getPayment = async (type: PaymentType, id: number, toast: CreateToastFnReturn) => {
    this.loadingPayment = true;
    const toastPending = toast(PaymentMessage.generating());
    const [err, res] = await catchErrorHandle(agent.PaymentAgent.create(type, id));
    runInAction(() => {
      toast.close(toastPending);
      if (err) {
        toast(PaymentMessage.failure(err.message));
      }
      if (res) {
        this.paymentUrl = res;
        toast(PaymentMessage.success());
      }
      this.loadingPayment = false;
    });
    return {err,res};
  };
}
