import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { BookingDetails } from '../models/booking.model';
import { catchErrorHandle } from '../helper/utils';
import { BookingMessage } from '../common/toastMessage';
import { OrderOfBooking } from '../models/order.model';

export default class BookingStore {
  loadingInitial: boolean = false;

  selectedBooking?: BookingDetails;
  constructor() {
    console.log('user store initialized');
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  getDetailsBooking = async (id: number, toast: any) => {
    this.loadingInitial = true;
    const [err, res] = await catchErrorHandle(agent.BookingAgent.getDetailsV1(id));
    runInAction(() => {
      if (err) {
        toast(BookingMessage.getDetailFailure);
      }
      if (res) {
        this.selectedBooking = res;
      }
      this.loadingInitial = false;
    });
  };

  pushOrderForBooking = (order: OrderOfBooking) => {
    console.log('begin push')
    if (this.selectedBooking) {
      console.log('pushing order')
      this.selectedBooking.ordersOfBooking.push(order);
    }
  };
}
