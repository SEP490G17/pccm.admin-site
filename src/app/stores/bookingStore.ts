import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import { BookingCreate, BookingForList, BookingModel, BookingStatus, mapBookingToBookingForList } from '../models/booking.model';
import { PaginationModel } from '../models/pagination.model';
import { BookingMessage } from '../common/toastMessage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default class BookingStore {
  loadingBooking: boolean = false;
  loadingInitial: boolean = false;
  bookingRegistry = new Map<number, BookingModel>();
  bookingTodayRegistry = new Map<number, BookingForList>();
  constructor() {
    makeAutoObservable(this);
  }

  loadBooking = async (toast: any) => {
    this.loadingBooking = true;
    const [error, res] = await catchErrorHandle<PaginationModel<BookingModel>>(
      agent.BookingAgent.getList(),
    );

    runInAction(() => {
      if (error) {
        toast(BookingMessage.loadFailure);
        return;
      }
      if (res) {
        res.data.forEach((booking) => {          
          this.setBookingToday(booking);
          this.setBooking(booking);
        }); // Use arrow function to preserve `this`
      }
      this.loadingBooking = false;
    });
  };
  createBooking = async (booking: BookingCreate) => {
    const [, res] = await catchErrorHandle(agent.BookingAgent.create(booking));
    runInAction(() => {
      if (res) {
        this.setBooking(res);
      }
    });
  };

  private setBooking(booking: BookingModel) {
    booking.startTime = dayjs(booking.startTime).format('YYYY-MM-DDTHH:mm:ss[Z]');
    booking.endTime = dayjs(booking.endTime).format('YYYY-MM-DDTHH:mm:ss[Z]');
    if(booking?.recurrenceRule !== ''){
      booking.RecurrenceRule = booking.recurrenceRule;
    }
    console.log(booking);
    this.bookingRegistry.set(booking.id, booking);
  }

  private setBookingToday = (booking: BookingModel) => {
    const today = dayjs().utc().startOf('day');
    const bookingStartTime = dayjs(booking.startTime).utc().startOf('day'); 
    if ( booking.status == BookingStatus.Confirmed && bookingStartTime.isSame(today, 'day')) {
       const bookingToday = mapBookingToBookingForList(booking);
      // Add to registry
      this.bookingTodayRegistry.set(booking.id, bookingToday);
    }
  };

  get bookingArray() {
    return Array.from(this.bookingRegistry.values());
  }

  get bookingTodayArray() {
    return Array.from(this.bookingTodayRegistry.values());
  }
}
