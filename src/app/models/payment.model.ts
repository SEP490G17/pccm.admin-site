import { ThemeTypings } from "@chakra-ui/react";

export enum PaymentStatus {
  Cancel,
  Pending,
  Success,
  Failed,
}

export enum PaymentType{
  Booking,
  Order,
}

export const getPaymentStatusText = (status:number) =>{
  switch (status) {
    case PaymentStatus.Pending:
      return 'Chờ thanh toán';
    case PaymentStatus.Failed:
      return 'Thanh toán thất bại';
    case PaymentStatus.Success:
      return 'Đã thanh toán';
    case PaymentStatus.Cancel:
      return 'Đã huỷ';
    default:
      return 'Không xác nhận';
  }
}

export const getPaymentStatusColor = (status:number):ThemeTypings['colorSchemes'] =>{

  switch (status) {
    case PaymentStatus.Pending:
      return 'blue';
    case PaymentStatus.Failed:
      return 'red';
    case PaymentStatus.Success:
      return 'teal';
    case PaymentStatus.Cancel:
      return 'red';
    default:
      return 'blackAlpha';
  }
}