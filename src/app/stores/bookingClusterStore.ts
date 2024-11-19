import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import {
  BookingCreate,
  BookingForList,
  BookingModel,
  BookingStatus,
  CourtPriceBooking,
  mapBookingResponseToBookingModel,
  mapBookingToBookingForList,
} from '../models/booking.model';
import { BookingMessage, CommonMessage, DefaultBookingText } from '../common/toastMessage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PaginationModel } from '../models/pagination.model';
import { PageParams } from '../models/pageParams.model';
import { CreateToastFnReturn } from '@chakra-ui/react';

dayjs.extend(utc);
dayjs.extend(timezone);

export default class BookingClusterStore {
  courtClusterId?: number;
  loadingSlot: boolean = false;
  courtPrice: CourtPriceBooking[]= [];
  // #region loading
  loadingBookingForSchedule: boolean = false;
  loadingInitial: boolean = false;
  loadingBookingPending: boolean = false;
  loadingBookingCancel: boolean = false;
  loadingBookingAll: boolean = false;
  loadingCourtPrice: boolean = false;

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
  loadBookingForSchedule = async (toast: CreateToastFnReturn, selectedDate?: string) => {
    if (this.courtClusterId) {
      this.loadingBookingForSchedule = true;
     
      const [error, res] = await catchErrorHandle<BookingModel[]>(
        agent.BookingAgent.getListForSchedule({
          courtClusterId: this.courtClusterId,
          selectedDate: selectedDate,
        }),
      );
      runInAction(() => {
        if (error) {
          toast(BookingMessage.loadFailure());
          return;
        }
        if (res) {
          res.forEach((booking) => {
            this.setBookingToday(mapBookingToBookingForList(booking));
            this.setBooking(booking);
          });
        }
        this.loadingBookingForSchedule = false;
      });
    }
  };
  loadBookingCancel = async (toast: CreateToastFnReturn) => {
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
          toast(BookingMessage.loadCancelFailure());
        }
        if (res) {
          res.data.forEach((booking) => {
            this.setBookingCancel(booking);
          });
          this.bookingCancelPageParam.pageSize = res.pageSize;
          this.bookingCancelPageParam.skip = this.bookingCancelRegistry.size;
          this.bookingCancelPageParam.totalElement = res.count;
        }
        this.loadingBookingCancel = false;
      });
    }
  };
  loadBookingPending = async (toast: CreateToastFnReturn) => {
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
          toast(BookingMessage.loadPendingFailure());
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

  loadBookingAll = async (toast: CreateToastFnReturn) => {
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
          toast(BookingMessage.loadPendingFailure());
        }
        if (!err && res) {
          res.data.forEach((booking) => {
            this.setBookingAll(booking);
          });
          this.bookingAllPageParam.pageSize = res.pageSize;
          this.bookingAllPageParam.skip = this.bookingAllRegistry.size;
          this.bookingAllPageParam.totalElement = res.count;
        }
        this.loadingBookingAll = false;
      });
    }
  };
  // #endregion

  acceptedBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.title.accept));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.acceptedBooking(id));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(BookingMessage.acceptFailure(undefined, err.message));
      }
      if (res) {
        toast(BookingMessage.acceptSuccess());
        this.bookingPendingRegistry.delete(id);
        this.setBookingAll(res);
        this.setBookingToday(this.convertBookingStartAndEndUTCToG7(res));
        this.setBooking(mapBookingResponseToBookingModel(res));
      }
    });
    return {err,res}
  };

  completeBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.title.accept));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.completeBooking(id));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(BookingMessage.completeFailure(undefined, err?.response.data));
      }
      if (res) {
        toast(BookingMessage.completeSuccess());
        this.setBookingAll(res);
        this.setBookingToday(this.convertBookingStartAndEndUTCToG7(res));
      }
    });
    return {err, res}
  };

  denyBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.title.accept));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.denyBooking(id));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(BookingMessage.denyFailure());
      }
      if (res) {
        this.bookingTodayRegistry.delete(res.id);
        this.bookingForScheduleRegistry.delete(res.id);
        toast(BookingMessage.denyFailure());
        this.setBookingAll(res);
      }
    });
    return {err, res}

  };

  cancelBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.title.accept));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.cancelBooking(id));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(BookingMessage.cancelFailure(undefined, err.message));
      }
      if (res) {
        this.bookingTodayRegistry.delete(res.id);
        toast(BookingMessage.cancelSuccess());
        this.setBookingAll(res);
        this.bookingForScheduleRegistry.delete(res.id);
        this.setBookingCancel(res);
      }
    });
    return {err, res}

  };

  createBooking = async (booking: BookingCreate) => {
    const [, res] = await catchErrorHandle(agent.BookingAgent.create(booking));
    runInAction(() => {
      if (res) {
        this.setBooking(res);
        const convert = mapBookingToBookingForList(res);
        this.setBookingToday(convert);
        this.bookingAllRegistry.set(convert.id,convert);
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

  private setBookingToday = (booking: BookingForList) => {
    const today = dayjs().tz('Asia/Ho_Chi_Minh').startOf('day'); // Ngày hôm nay theo GMT+7
    const bookingStartTime = dayjs(booking.startDay, 'DD/MM/YYYY')
      .tz('Asia/Ho_Chi_Minh')
      .startOf('day');
    const bookingEndTime = dayjs(booking.endDay, 'DD/MM/YYYY')
      .tz('Asia/Ho_Chi_Minh')
      .startOf('day');
    if (
      booking.status === BookingStatus.Confirmed &&
      (bookingStartTime.isSame(today, 'day') ||
        bookingEndTime.isSame(today, 'day') ||
        (bookingStartTime.isBefore(today, 'day') && bookingEndTime.isAfter(today, 'day')))
    ) {
      // Add to registry
      this.bookingTodayRegistry.set(booking.id, booking);
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
    const startDay = startTime.format('DD/MM/YYYY');
    const endDay = endTime.format('DD/MM/YYYY');
    return { ...booking, startDay, endDay };
  }

  loadCourtPrice = async (value: number) => {
    this.loadingCourtPrice = true;
    const [error, res] = await catchErrorHandle<CourtPriceBooking[]>(
      agent.BookingAgent.priceCourt(value),
    );
    runInAction(() => {
      if (error) {
        return;
      }
      if (res) {
        this.courtPrice = res;
      }
    });
    this.loadingCourtPrice = false;
  };

  get bookingScheduleArray() {
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

  clearBookingForSchedule(){
    this.bookingForScheduleRegistry.clear();
    this.bookingTodayRegistry.clear();
    this.bookingCancelRegistry.clear();
    this.bookingAllRegistry.clear();
    this.bookingForScheduleRegistry.clear();
  }
}
