import { dateFormatOptions } from './settings';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { BookingForList } from '../models/booking.model';

dayjs.extend(utc);
dayjs.extend(timezone);
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const customFormatDate = (date: Date): string => {
  return date.toLocaleString('vi-VN', dateFormatOptions).trim();
};

export const customFormatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};
export const customFormatTimeWithText = (time: string) => {
  let [hours, minutes] = time.split(':');
  if (hours[0] === '0') {
    hours = hours.slice(1);
  }
  return `${hours}h${minutes == '00' ? '' : ':' + minutes}`;
};
export const catchErrorHandle = async <T>(
  promise: Promise<T>,
): Promise<[undefined, T] | [Error|any]> => {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error];
    });
};
   

export const convertBookingStartAndEndUTCToG7 = (booking: BookingForList) => {
  const startTime = dayjs(booking.startDay).add(7, 'hour'); // Convert to GMT+7
  const endTime = dayjs(booking.endDay).add(7, 'hour'); // Convert to GMT+7
  const startDay = startTime.format('DD/MM/YYYY');
  const endDay = endTime.format('DD/MM/YYYY');
  return { ...booking, startDay, endDay };
}

export const isNumber = (value: any): boolean =>{
  return typeof value === 'number' &&!isNaN(value);
}

export function calculateTimeDifferenceInHours(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const differenceInMinutes = endTotalMinutes - startTotalMinutes;

  const differenceInHours = differenceInMinutes / 60;

  return parseFloat(differenceInHours.toFixed(2));
}