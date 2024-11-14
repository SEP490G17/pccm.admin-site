import { PaymentType } from './../models/payment.model';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import { BookingMessage } from '../common/toastMessage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default class PaymentStore {
  loadingPayment: boolean = false;
  paymentUrl: string ='';
  constructor() {
    makeAutoObservable(this);
  }
  getPayment = async (type:PaymentType, id:number, amount:number, toast:any) =>{
    this.loadingPayment = true;
    const [err, res] = await catchErrorHandle(agent.PaymentAgent.create(type, id, amount));
    runInAction(()=>{
        if(err){
            toast(BookingMessage.loadFailure);
        }
        if(!err && res){
            this.paymentUrl = res;
        }
        this.loadingPayment = false;
    })
  }
}
