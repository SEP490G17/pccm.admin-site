import { BookingForList } from '@/app/models/booking.model';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import {
  BookingCreate,
  BookingModel,
  BookingStatus,
  mapBookingToBookingForList,
} from '../models/booking.model';
import { BookingMessage } from '../common/toastMessage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PaginationModel } from '../models/pagination.model';
import { PageParams } from '../models/pageParams.model';

dayjs.extend(utc);
dayjs.extend(timezone);

export default class BookingClusterStore {
  courtClusterId?: number;

  // #region loading
  loadingBookingForSchedule: boolean = false;
  loadingInitial: boolean = false;
  loadingBookingPending: boolean = false;
  loadingBookingCancel: boolean = false;
  loadingBookingAll: boolean = false;

  // #endregion

  // #region pageParams
  bookingPendingPageParam = new PageParams();
  bookingCancelPageParam = new PageParams();
  bookingAllPageParam = new PageParams();
  // #endregion

  // #region registry
  bookingForScheduleRegistry = new Map<number, BookingModel>();
  bookingTodayRegistry = new Map<number, BookingForList>();
  bookingPendingRegistry = new Map<number, BookingForList>();
  bookingAllRegistry = new Map<number, BookingForList>();
  bookingCancelRegistry = new Map<number, BookingForList>();
  // #endregion

  constructor() {
    makeAutoObservable(this);
    this.bookingPendingPageParam.pageSize = 10;
  }
  public setCourtClusterId(id: number) {
    this.courtClusterId = id;
  }

  // #region load danh sách booking
  loadBookingForSchedule = async (toast: any) => {
    if (this.courtClusterId) {
      this.loadingBookingForSchedule = true;
      const [error, res] = await catchErrorHandle<BookingModel[]>(
        agent.BookingAgent.getListForSchedule(this.courtClusterId),
      );
      runInAction(() => {
        if (error) {
          toast(BookingMessage.loadFailure);
          return;
        }
        if (res) {
          res.forEach((booking) => {
            this.setBookingToday(booking);
            this.setBooking(booking);
          });
        }
        this.loadingBookingForSchedule = false;
      });
    }
  };
  loadBookingCancel = async (toast: any) => {
    if (this.courtClusterId) {
      this.loadingBookingCancel = true;
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.bookingCancelPageParam.skip}`);
      queryParams.append('pageSize', `${this.bookingCancelPageParam.pageSize}`);
      queryParams.append('courtClusterId', `${this.courtClusterId}`);
      queryParams.append('status', `${BookingStatus.Cancelled}`);
      if (this.bookingCancelPageParam.searchTerm) {
        queryParams.append('search', this.bookingCancelPageParam.searchTerm);
      }
      const [err, res] = await catchErrorHandle<PaginationModel<BookingForList>>(
        agent.BookingAgent.getListV2(`?${queryParams.toString()}`),
      );
      runInAction(() => {
        if (err) {
          toast(BookingMessage.loadingCancelFailure);
        }
        if (res) {
          res.data.forEach((booking) => {
            this.setBookingCancel(booking);
          });
          this.bookingCancelPageParam.pageSize = res.pageSize;
          this.bookingCancelPageParam.skip = this.bookingPendingRegistry.size;
          this.bookingCancelPageParam.totalElement = res.count;
        }
        this.loadingBookingCancel = false;
      });
    }
  };
  loadBookingPending = async (toast: any) => {
    if (this.courtClusterId) {
      this.loadingBookingPending = true;
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.bookingPendingPageParam.skip}`);
      queryParams.append('pageSize', `${this.bookingPendingPageParam.pageSize}`);
      queryParams.append('courtClusterId', `${this.courtClusterId}`);
      queryParams.append('status', `${BookingStatus.Pending}`);
      if (this.bookingPendingPageParam.searchTerm) {
        queryParams.append('search', this.bookingPendingPageParam.searchTerm);
      }
      const [err, res] = await catchErrorHandle<PaginationModel<BookingForList>>(
        agent.BookingAgent.getListV2(`?${queryParams.toString()}`),
      );

      runInAction(() => {
        if (err) {
          toast(BookingMessage.loadingPendingFailure);
        }
        if (!err && res) {
          res.data.forEach((booking) => {
            this.setBookingPending(booking);
          });
          this.bookingPendingPageParam.pageSize = res.pageSize;
          this.bookingPendingPageParam.skip = this.bookingPendingRegistry.size;
          this.bookingPendingPageParam.totalElement = res.count;
        }
        this.loadingBookingPending = false;
      });
    }
  };

  loadBookingAll = async (toast: any) => {
    if (this.courtClusterId) {
      this.loadingBookingAll = true;
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.bookingAllPageParam.skip}`);
      queryParams.append('pageSize', `${this.bookingAllPageParam.pageSize}`);
      queryParams.append('courtClusterId', `${this.courtClusterId}`);
      if (this.bookingAllPageParam.searchTerm) {
        queryParams.append('search', this.bookingAllPageParam.searchTerm);
      }
      const [err, res] = await catchErrorHandle<PaginationModel<BookingForList>>(
        agent.BookingAgent.getListV2(`?${queryParams.toString()}`),
      );

      runInAction(() => {
        if (err) {
          toast(BookingMessage.loadingPendingFailure);
        }
        if (!err && res) {
          res.data.forEach((booking) => {
            this.setBookingAll(booking);
          });
          this.bookingAllPageParam.pageSize = res.pageSize;
          this.bookingAllPageParam.skip = this.bookingPendingRegistry.size;
          this.bookingAllPageParam.totalElement = res.count;
        }
        this.loadingBookingAll = false;
      });
    }
  };
  // #endregion

  createBooking = async (booking: BookingCreate) => {
    const [, res] = await catchErrorHandle(agent.BookingAgent.create(booking));
    runInAction(() => {
      if (res) {
        this.setBooking(res);
      }
    });
  };

  updateTodayUrlBooking = (url: string, bookingId: number) => {
    const update = this.bookingTodayRegistry.get(bookingId);

    if (update) {
      update.paymentUrl = url; // Now safe to assign because `update` is checked
      this.bookingTodayRegistry.set(bookingId, update);
    }
  };

  private setBooking(booking: BookingModel) {
    booking.startTime = dayjs(booking.startTime).format('YYYY-MM-DDTHH:mm:ss[Z]');
    booking.endTime = dayjs(booking.endTime).format('YYYY-MM-DDTHH:mm:ss[Z]');
    if (booking.recurrenceRule) {
      booking.RecurrenceRule = booking.recurrenceRule;
    }
    this.bookingForScheduleRegistry.set(booking.id, booking);
  }

  private setBookingToday = (booking: BookingModel) => {
    const today = dayjs().utc().startOf('day');
    const bookingStartTime = dayjs(booking.startTime).utc().startOf('day');
    if (booking.status == BookingStatus.Confirmed && bookingStartTime.isSame(today, 'day')) {
      const bookingToday = mapBookingToBookingForList(booking);
      // Add to registry
      this.bookingTodayRegistry.set(booking.id, bookingToday);
    }
  };

  private setBookingPending = (booking: BookingForList) => {
    this.bookingPendingRegistry.set(booking.id, this.convertBookingStartAndEndUTCToG7(booking));
  };
  private setBookingCancel = (booking: BookingForList) => {
    this.bookingCancelRegistry.set(booking.id, this.convertBookingStartAndEndUTCToG7(booking));
  };

  private setBookingAll = (booking: BookingForList) => {
    this.bookingAllRegistry.set(booking.id, this.convertBookingStartAndEndUTCToG7(booking));
  };

  private convertBookingStartAndEndUTCToG7(booking: BookingForList) {
    const startTime = dayjs(booking.startDay).add(7, 'hour'); // Convert to GMT+7
    const endTime = dayjs(booking.endDay).add(7, 'hour'); // Convert to GMT+7
    booking.startDay = startTime.format('DD/MM/YYYY');
    booking.endDay = endTime.format('DD/MM/YYYY');
    return booking;
  }

  get bookingArray() {
    return Array.from(this.bookingForScheduleRegistry.values());
  }

  get bookingTodayArray() {
    return Array.from(this.bookingTodayRegistry.values());
  }

  get bookingPendingArray() {
    return Array.from(this.bookingPendingRegistry.values());
  }

  get bookingCancelArray() {
    return Array.from(this.bookingCancelRegistry.values());
  }
  get bookingAllArray() {
    return Array.from(this.bookingAllRegistry.values());
  }
}
