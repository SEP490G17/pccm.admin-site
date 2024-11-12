import dayjs from 'dayjs';


export interface BookingCreate {
  PhoneNumber: string;
  FullName: string;
  CourtId: number;
  StartTime: string; // Thời gian bắt đầu đặt sân
  EndTime: string; // Thời gian kết thúc đặt sân
  RecurrenceRule: string; // Thời lượng đặt sân
  UntilTime?: string;
}

export interface BookingModel {
  id: number;
  phoneNumber: string;
  fullName: string;
  courtId: number;
  courtName	:string;
  startTime: string; // Thời gian bắt đầu đặt sân
  endTime: string; // Thời gian kết thúc đặt sân
  RecurrenceRule: string; // Thời lượng đặt sân
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
  playTime: string; // Thời gian bắt đầu đặt sân
  startDay:string;
  endDay: string;
  paymentStatus: number;
  paymentUrl?: string;
  status: number;
  isSuccess: boolean;
  totalPrice: number;
}

export const mapBookingToBookingForList = (booking: BookingModel): BookingForList => {
  const startTime = dayjs(booking.startTime).add(7, 'hour'); // Convert to GMT+7
  const endTime = dayjs(booking.endTime).add(7, 'hour'); // Convert to GMT+7
  const untilTime = booking.untilTime ? dayjs(booking.untilTime).add(7, 'hour') : null; // Convert to GMT+7
  
  // Format playTime in 24-hour format: HH:mm - HH:mm
  const playTime = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;

  // Format startDay and endDay in 'YYYY-MM-DD' in GMT+7
  const startDay = startTime.format('DD/MM/YYYY');
  const endDay = untilTime ? untilTime.format('DD/MM/YYYY') : endTime.format('DD/MM/YYYY');
  return {
    id: booking.id,
    phoneNumber: booking.phoneNumber,
    fullName: booking.fullName,
    courtName: booking.courtName, // Note: this seems to be a number in BookingForList
    playTime: playTime,
    startDay: startDay,
    endDay: endDay,
    paymentStatus: booking.paymentStatus,
    paymentUrl: booking.paymentUrl,
    status: booking.status,
    isSuccess: booking.isSuccess,
    totalPrice: booking.totalPrice
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
