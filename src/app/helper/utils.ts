import { dateFormatOptions } from './settings';

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const customFormatDate = (date: Date): string => {
  return date.toLocaleString('vi-VN', dateFormatOptions).trim();
};
