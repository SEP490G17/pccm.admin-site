import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import {
  BookingCreate,
  BookingForList,
  BookingModel,
  BookingStatus,
  CourtPriceBooking,
  IBookingWithCombo,
  mapBookingResponseToBookingModel,
  mapBookingToBookingForList,
} from '../models/booking.model';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PaginationModel } from '../models/pagination.model';
import { BookingPageParams, BookingTodayPageParams } from '../models/pageParams.model';
import { CreateToastFnReturn, useToast } from '@chakra-ui/react';
import { BookingMessage, DefaultBookingText } from '../common/toastMessage/bookingMessage';
import { CommonMessage } from '../common/toastMessage/commonMessage';
dayjs.extend(utc);
dayjs.extend(timezone);
import _ from 'lodash';
export default class BookingClusterStore {
  courtClusterId?: number;
  loadingSlot: boolean = false;
  courtPrice: CourtPriceBooking[] = [];
  // #region loading
  loadingBookingForSchedule: boolean = false;
  loadingInitial: boolean = false;
  loadingBookingPending: boolean = false;
  loadingBookingDeny: boolean = false;
  loadingBookingAll: boolean = false;
  loadingCourtPrice: boolean = false;

  // #endregion

  // #region pageParams
  bookingPendingPageParam = new BookingPageParams();
  bookingDenyPageParam = new BookingPageParams();
  bookingAllPageParam = new BookingPageParams();
  bookingTodayPageParam = new BookingTodayPageParams();
  // #endregion

  // #region registry
  bookingForScheduleRegistry = new Map<number, BookingModel>();
  bookingTodayRegistry = new Map<number, BookingForList>();
  bookingPendingRegistry = new Map<number, BookingForList>();
  bookingAllRegistry = new Map<number, BookingForList>();
  bookingDenyRegistry = new Map<number, BookingForList>();
  // #endregion

  bookingTodayArray: BookingForList[] = [];

  constructor() {
    makeAutoObservable(this);
    this.bookingPendingPageParam.pageSize = 10;
    this.bookingTodayPageParam.filter = '';
  }
  public setCourtClusterId(id: number) {
    this.courtClusterId = id;
  }

  // #region load booking registry
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
          console.group('Today');
          res.forEach((booking) => {
            this.setBooking(booking);
            const lichConvert = mapBookingToBookingForList(booking);

            this.setBookingToday(lichConvert);
          });
          console.groupEnd();
        }
        this.loadingBookingForSchedule = false;
      });
    }
  };
  loadBookingDeny = async (toast: CreateToastFnReturn) => {
    if (this.courtClusterId) {
      this.loadingBookingDeny = true;
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.bookingDenyPageParam.skip}`);
      queryParams.append('pageSize', `${this.bookingDenyPageParam.pageSize}`);
      queryParams.append('courtClusterId', `${this.courtClusterId}`);
      queryParams.append('status', `${BookingStatus.Declined}`);
      if (this.bookingDenyPageParam.courtId) {
        queryParams.append('courtId', `${this.bookingDenyPageParam.courtId}`);
      }
      if (this.bookingDenyPageParam.fromDate != null) {
        queryParams.append('fromDate', this.bookingDenyPageParam.fromDate);
      }
      if (this.bookingDenyPageParam.toDate != null) {
        queryParams.append('toDate', this.bookingDenyPageParam.toDate);
      }
      if (this.bookingDenyPageParam.searchTerm) {
        queryParams.append('search', this.bookingDenyPageParam.searchTerm);
      }
      if (this.bookingDenyPageParam.searchTerm) {
        queryParams.append('search', this.bookingDenyPageParam.searchTerm);
      }
      const [err, res] = await catchErrorHandle<PaginationModel<BookingForList>>(
        agent.BookingAgent.getListV2(`?${queryParams.toString()}`),
      );
      runInAction(() => {
        if (err) {
          toast(BookingMessage.loadDenyFailure());
        }
        if (res) {
          res.data.forEach((booking) => {
            this.setBookingDeny(booking);
          });
          this.bookingDenyPageParam.pageSize = res.pageSize;
          this.bookingDenyPageParam.skip = this.bookingDenyRegistry.size;
          this.bookingDenyPageParam.totalElement = res.count;
        }
        this.loadingBookingDeny = false;
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
      if (this.bookingPendingPageParam.courtId) {
        queryParams.append('courtId', `${this.bookingPendingPageParam.courtId}`);
      }
      if (this.bookingPendingPageParam.fromDate != null) {
        queryParams.append('fromDate', this.bookingPendingPageParam.fromDate);
      }
      if (this.bookingPendingPageParam.toDate != null) {
        queryParams.append('toDate', this.bookingPendingPageParam.toDate);
      }
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
      if (this.bookingAllPageParam.courtId) {
        queryParams.append('courtId', `${this.bookingAllPageParam.courtId}`);
      }
      if (this.bookingAllPageParam.fromDate != null) {
        queryParams.append('fromDate', this.bookingAllPageParam.fromDate);
      }
      if (this.bookingAllPageParam.toDate != null) {
        queryParams.append('toDate', this.bookingAllPageParam.toDate);
      }
      if (this.bookingAllPageParam.status != null) {
        queryParams.append('status', `${this.bookingAllPageParam.status}`);
      }
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

  //#region booking interact
  acceptedBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.accept.title));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.acceptedBooking(id));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(
          BookingMessage.acceptFailure(
            err?.response.data,
          ),
        );
      }
      if (res) {
        toast(BookingMessage.acceptSuccess());
        this.bookingPendingRegistry.delete(id);
        this.setBookingAll(res);
        this.setBookingToday(this.convertBookingStartAndEndUTCToG7(res));
        this.loadBookingTodayArray();
        this.setBooking(mapBookingResponseToBookingModel(res));
      }
    });
    return { err, res };
  };

  completeBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.complete.title));
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
        this.loadBookingTodayArray();
      }
    });
    return { err, res };
  };

  denyBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.deny.title));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.denyBooking(id));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(BookingMessage.denyFailure());
      }
      if (res) {
        this.bookingTodayRegistry.delete(res.id);
        this.loadBookingTodayArray();
        this.bookingForScheduleRegistry.delete(res.id);
        this.bookingPendingRegistry.delete(id);
        toast(BookingMessage.denySuccess());
        this.setBookingAll(res);
      }
    });
    return { err, res };
  };

  denyConflictBooking = async (data: number[], toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.deny.title));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.denyBookingConflict(data));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(BookingMessage.acceptFailure());
      }
      if (res) {
        res.forEach(
          (data) => (
            this.bookingTodayRegistry.delete(data.id),
            this.loadBookingTodayArray(),
            this.bookingForScheduleRegistry.delete(data.id),
            this.bookingPendingRegistry.delete(data.id),
            this.setBookingAll(data)
          ),
        );
        toast(BookingMessage.acceptSuccess());
      }
    });
    return { err, res };
  };

  cancelBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage(DefaultBookingText.cancel.title));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.cancelBooking(id));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(BookingMessage.cancelFailure(undefined, err.message));
      }
      if (res) {
        this.bookingTodayRegistry.delete(res.id);
        this.loadBookingTodayArray();
        toast(BookingMessage.cancelSuccess());
        this.setBookingAll(res);
        this.bookingForScheduleRegistry.delete(res.id);
        this.setBookingDeny(res);
      }
    });
    return { err, res };
  };

  createBooking = async (booking: BookingCreate, toast: CreateToastFnReturn) => {
    const pendingToast = toast(CommonMessage.loadingMessage('Đặt lịch'));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.create(booking));
    runInAction(() => {
      toast.close(pendingToast);
      if (err) {
        toast(BookingMessage.bookingFailure(err?.response?.data));
      }

      if (res) {
        toast(BookingMessage.bookingSuccess());
        this.setBooking(res);
        const convert = mapBookingToBookingForList(res);
        this.setBookingToday(convert);
        this.bookingAllRegistry.set(convert.id, convert);
      }
    });
    return { err, res };
  };

  bookingWithCombo = async (booking: IBookingWithCombo, toast: CreateToastFnReturn) => {
    const pending = toast(CommonMessage.loadingMessage(DefaultBookingText.booking.title));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.bookingWithCombo(booking));
    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(BookingMessage.bookingFailure(err?.response?.data));
        return;
      }

      if (res) {
        toast(BookingMessage.bookingSuccess());
        this.setBooking(res);
        const convert = mapBookingToBookingForList(res);
        this.setBookingToday(convert);
        this.bookingAllRegistry.set(convert.id, convert);
      }
    });
  };

  paymentSuccessBooking = async (id: number, toast: CreateToastFnReturn) => {
    const pending = toast(CommonMessage.loadingMessage('Xác thực thanh toán'));
    const [err, res] = await catchErrorHandle(agent.BookingAgent.paymentSuccess(id));
    runInAction(() => {
      if (res) {
        toast.close(pending);
        toast(BookingMessage.paymentSuccess());
        console.log(res)
        this.bookingTodayRegistry.set(res.id, this.convertBookingStartAndEndUTCToG7(res));
        this.loadBookingTodayArray();
        this.setBookingAll(res);
      }
      if (err) {
        toast(BookingMessage.paymentFailure(err?.response?.data));
      }
    });

    return { err, res };
  };

  //#endregion

  //#region set booking
  updateTodayUrlBooking = (url: string, bookingId: number) => {
    const update = this.bookingTodayRegistry.get(bookingId);

    if (update) {
      update.paymentUrl = url; // Now safe to assign because `update` is checked
      this.bookingTodayRegistry.set(bookingId, update);
    }
  };

  setBooking(booking: BookingModel) {
    booking.startTime = dayjs(booking.startTime).format('YYYY-MM-DDTHH:mm:ss[Z]');
    booking.endTime = dayjs(booking.endTime).format('YYYY-MM-DDTHH:mm:ss[Z]');
    if (booking.recurrenceRule) {
      booking.RecurrenceRule = booking.recurrenceRule;
    }
    this.bookingForScheduleRegistry.set(booking.id, booking);
  }

  setBookingToday = (booking: BookingForList) => {
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

  setBookingPending = (booking: BookingForList) => {
    this.bookingPendingRegistry.set(booking.id, this.convertBookingStartAndEndUTCToG7(booking));
  };
  setBookingDeny = (booking: BookingForList) => {
    this.bookingDenyRegistry.set(booking.id, this.convertBookingStartAndEndUTCToG7(booking));
  };
  setBookingAll = (booking: BookingForList) => {
    this.bookingAllRegistry.set(booking.id, this.convertBookingStartAndEndUTCToG7(booking));
  };
  //#endregion

  //#region get booking Array
  get bookingScheduleArray() {
    return Array.from(this.bookingForScheduleRegistry.values());
  }
  get bookingPendingArray() {
    return Array.from(this.bookingPendingRegistry.values());
  }
  get bookingDenyArray() {
    return Array.from(this.bookingDenyRegistry.values());
  }
  get bookingAllArray() {
    return Array.from(this.bookingAllRegistry.values());
  }
  //#endregion

  //#region booking tab business

  //#region bookingToday business
  loadBookingTodayArray() {
    this.bookingTodayArray = _.orderBy(
      Array.from(this.bookingTodayRegistry.values()).filter(
        (c) =>
          (!this.bookingTodayPageParam.searchTerm ||
            _.includes(c.fullName, this.bookingTodayPageParam.searchTerm) ||
            _.includes(c.courtName, this.bookingTodayPageParam.searchTerm) ||
            _.includes(c.phoneNumber, this.bookingTodayPageParam.searchTerm)) &&
          (!this.bookingTodayPageParam.filter ||
            c.courtId === Number(this.bookingTodayPageParam.filter)) &&
          (!this.bookingTodayPageParam.category ||
            (this.bookingTodayPageParam.category == 1 &&
              (!c.RecurrenceRule || !c.recurrenceRule)) ||
            (this.bookingTodayPageParam.category == 2 && (c.RecurrenceRule || c.recurrenceRule))),
      ),
      ['id'],
      'desc',
    );
  }
  bookingTodaySetSearchTerm = (value: string) => {
    this.bookingTodayPageParam.searchTerm = value;
    this.loadBookingTodayArray();
  };
  bookingTodaySetFilterTerm = (value: string) => {
    this.bookingTodayPageParam.filter = value;
    this.loadBookingTodayArray();
  };
  bookingTodaySetCategoryTerm = (value: number) => {
    this.bookingTodayPageParam.category = value;
    this.loadBookingTodayArray();
  };
  //#endregion

  //#region bookingAll business
  filterBookingAllByCourt = async (courtId: number, toast: CreateToastFnReturn) => {
    this.bookingAllRegistry.clear();
    this.bookingAllPageParam.clearLazyPage();
    this.bookingAllPageParam.courtId = courtId;
    await this.loadBookingAll(toast);
  };

  filterBookingAllByDate = async (
    date1: string | null,
    date2: string | null,
    toast: CreateToastFnReturn,
  ) => {
    this.bookingAllRegistry.clear();
    this.bookingAllPageParam.clearLazyPage();
    this.bookingAllPageParam.fromDate = date1;
    this.bookingAllPageParam.toDate = date2;
    await this.loadBookingAll(toast);
  };

  filterBookingAllByStatus = async (status: number, toast: CreateToastFnReturn) => {
    this.bookingAllRegistry.clear();
    this.bookingAllPageParam.clearLazyPage();
    this.bookingAllPageParam.status = status;
    await this.loadBookingAll(toast);
  };

  setBookingAllSearchTerm = async (searchTearm: string, toast: CreateToastFnReturn) => {
    this.bookingAllRegistry.clear();
    this.bookingAllPageParam.clearLazyPage();
    this.bookingAllPageParam.searchTerm = searchTearm;
    await this.loadBookingAll(toast);
  };

  //#endregion

  //#region booking deny business
  filterBookingDenyByCourt = async (courtId: number, toast: CreateToastFnReturn) => {
    this.bookingDenyRegistry.clear();
    this.bookingDenyPageParam.clearLazyPage();
    this.bookingDenyPageParam.courtId = courtId;
    await this.loadBookingDeny(toast);
  };

  filterBookingDenyByDate = async (
    date1: string | null,
    date2: string | null,
    toast: CreateToastFnReturn,
  ) => {
    this.bookingDenyRegistry.clear();
    this.bookingDenyPageParam.clearLazyPage();
    this.bookingDenyPageParam.fromDate = date1;
    this.bookingDenyPageParam.toDate = date2;
    await this.loadBookingDeny(toast);
  };

  setBookingDenySearchTerm = async (searchTearm: string, toast: CreateToastFnReturn) => {
    this.bookingDenyRegistry.clear();
    this.bookingDenyPageParam.clearLazyPage();
    this.bookingDenyPageParam.searchTerm = searchTearm;
    await this.loadBookingDeny(toast);
  };

  //#endregion

  //#region  booking pending business
  filterBookingPendingByCourt = async (courtId: number, toast: CreateToastFnReturn) => {
    this.bookingPendingRegistry.clear();
    this.bookingPendingPageParam.clearLazyPage();
    this.bookingPendingPageParam.courtId = courtId;
    await this.loadBookingPending(toast);
  };

  filterBookingPendingByDate = async (
    date1: string | null,
    date2: string | null,
    toast: CreateToastFnReturn,
  ) => {
    this.bookingPendingRegistry.clear();
    this.bookingPendingPageParam.clearLazyPage();
    this.bookingPendingPageParam.fromDate = date1;
    this.bookingPendingPageParam.toDate = date2;
    await this.loadBookingPending(toast);
  };

  setBookingPendingSearchTerm = async (searchTearm: string, toast: CreateToastFnReturn) => {
    this.bookingPendingRegistry.clear();
    this.bookingPendingPageParam.clearLazyPage();
    this.bookingPendingPageParam.searchTerm = searchTearm;
    await this.loadBookingPending(toast);
  };

  //#endregion

  //#endregion

  //#region  support function
  private convertBookingStartAndEndUTCToG7(booking: BookingForList) {
    const startTime = dayjs(booking.startDay).add(7, 'hour'); // Convert to GMT+7
    const endTime = dayjs(booking.endDay).add(7, 'hour'); // Convert to GMT+7
    const startDay = startTime.format('DD/MM/YYYY');
    const endDay = endTime.format('DD/MM/YYYY');
    return { ...booking, startDay, endDay };
  }

  clearBookingForSchedule() {
    this.bookingForScheduleRegistry.clear();
    this.bookingTodayRegistry.clear();
    this.bookingDenyRegistry.clear();
    this.bookingAllRegistry.clear();
    this.bookingForScheduleRegistry.clear();
  }
  //#endregion
}
