import dayjs from 'dayjs';
import { OrderOfBooking } from './order.model';
import { ThemeTypings } from '@chakra-ui/react';

export interface BookingCreate {
  PhoneNumber: string;
  FullName: string;
  CourtId: number;
  StartTime: string; // Thời gian bắt đầu đặt sân
  EndTime: string; // Thời gian kết thúc đặt sân
}

export interface BookingConflict {
  BookingId: number;
  CourtId?: number;
  FromDate: string;
  FromTime: string; // Thời gian bắt đầu đặt sân
  ToTime: string; // Thời gian kết thúc đặt sân
}

export interface BookingModel {
  id: number;
  phoneNumber: string;
  fullName: string;
  courtId: number;
  courtName: string;
  startTime: string; // Thời gian bắt đầu đặt sân
  endTime: string; // Thời gian kết thúc đặt sân
  RecurrenceRule: string; // Thời lượng đặt sân
  recurrenceRule?: string | undefined; // Th
  untilTime?: string;
  paymentStatus: number;
  paymentUrl?: string;
  status: number;
  isSuccess: boolean;
  totalPrice: number;
}

export interface BookingForSchedule {
  Id: number;
  PhoneNumber: string;
  FullName: string;
  courtId: number;
  StartTime: string; // Thời gian bắt đầu đặt sân
  EndTime: string; // Thời gian kết thúc đặt sân
  RecurrenceRule: string; // Thời lượng đặt sân
  PaymentStatus: number;
  Status: number;
  IsSuccess: boolean;
}

export interface BookingForList {
  id: number;
  phoneNumber: string;
  fullName: string;
  courtName: string;
  courtId?: number;
  courtClusterName?: string;
  playTime: string; // Thời gian bắt đầu đặt sân
  startDay: string;
  endDay: string;
  paymentStatus: number;
  paymentUrl?: string;
  status: number;
  isSuccess: boolean;
  totalPrice: number;
  RecurrenceRule?: string;
  recurrenceRule?: string;
}

export interface BookingInfo extends BookingForList {
  courtClusterId: number;
  address: string;
}

export interface CourtPriceBooking {
  courtId: number;
  courtName: string;
  time: string;
  price: number;
}

export const mapBookingToBookingForList = (booking: BookingModel): BookingForList => {
  const startTime = dayjs(booking.startTime).utc().add(7, 'hour'); // Convert to GMT+7
  const endTime = dayjs(booking.endTime).utc().add(7, 'hour'); // Convert to GMT+7
  const untilTime = booking.untilTime ? dayjs(booking.untilTime) : null; // Convert to GMT+7
  // Format playTime in 24-hour format: HH:mm - HH:mm
  const playTime = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;
  // Format startDay and endDay in 'YYYY-MM-DD' in GMT+7
  const startDay = startTime.format('DD/MM/YYYY');
  const endDay = untilTime ? untilTime.format('DD/MM/YYYY') : endTime.format('DD/MM/YYYY');
  const recu = booking.RecurrenceRule ? booking.RecurrenceRule : booking.recurrenceRule;
  return {
    id: booking.id,
    phoneNumber: booking.phoneNumber,
    fullName: booking.fullName,
    courtName: booking.courtName, // Note: this seems to be a number in BookingForList
    playTime: playTime,
    startDay: startDay,
    endDay: endDay,
    courtId: booking.courtId,
    paymentStatus: booking.paymentStatus,
    paymentUrl: booking.paymentUrl,
    status: booking.status,
    isSuccess: booking.isSuccess,
    totalPrice: booking.totalPrice,
    RecurrenceRule: recu,
    recurrenceRule: recu,
  };
};
export const mapBookingResponseToBookingModel = (booking: BookingForList): BookingModel => {
  const recu = booking.RecurrenceRule ? booking.RecurrenceRule : booking.recurrenceRule;
  return {
    courtId: booking.courtId ?? 0,
    courtName: booking.courtName,
    endTime: booking.endDay,
    startTime: booking.startDay,
    paymentStatus: booking.paymentStatus,
    paymentUrl: booking.paymentUrl,
    status: booking.status,
    isSuccess: booking.isSuccess,
    fullName: booking.fullName,
    phoneNumber: booking.phoneNumber,
    totalPrice: booking.totalPrice,
    RecurrenceRule: recu ?? '',
    recurrenceRule: recu,
    id: booking.id,
    untilTime: '',
  };
};

export enum BookingStatus {
  Pending,
  Confirmed,
  Declined,
  Cancelled,
}

export interface BookingRecent {
  id: number;
  fullName: string;
  courtName: string;
  courtClusterName: string;
  imageUrl: string;
}

export interface BookingDetails {
  bookingDetails: BookingInfo;
  ordersOfBooking: OrderOfBooking[];
}

export const getBookingStatusText = (status: number) => {
  switch (status) {
    case BookingStatus.Pending:
      return 'Chờ xác nhận';
    case BookingStatus.Confirmed:
      return 'Đã xác nhận';
    case BookingStatus.Declined:
      return 'Đang từ chối';
    case BookingStatus.Cancelled:
      return 'Đã huỷ';
    default:
      return 'Không xác nhận';
  }
};

export const getBookingStatusColor = (status: number): ThemeTypings['colorSchemes'] => {
  switch (status) {
    case BookingStatus.Pending:
      return 'blue';
    case BookingStatus.Confirmed:
      return 'green';
    case BookingStatus.Declined:
      return 'red';
    case BookingStatus.Cancelled:
      return 'orange';
    default:
      return 'blackAlpha';
  }
};

export interface IBookingWithCombo {
  fullName: string;
  phoneNumber: string;
  courtId: number;
  fromDate: Date;
  comboId: number;
  fromTime: string;
  toTime: string;
}

export class BookingWithCombo implements IBookingWithCombo {
  fullName: string = '';
  phoneNumber: string = '';
  courtId: number = 0;
  fromDate = new Date();
  comboId: number = 0;
  fromTime: string = '';
  toTime: string = '';
}
export interface BookingByDay {
  courtId: number;
  fromDate: string;
  fromTime: string;
  toTime: string;
  fullName: string;
  phoneNumber: string;
}
