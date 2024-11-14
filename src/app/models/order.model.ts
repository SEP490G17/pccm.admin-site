import { PaymentStatus } from './payment.model';

export interface OrderOfBooking {
  id: number;
  createdAt: number;
  paymentStatus: PaymentStatus;
  isOpen: boolean;
  totalAmount: number;
}

export interface OrderCreate {
  bookingId: number;
  orderForProducts: OrderForProducts[];
  orderForServices: OrderForServices[];
}

export interface OrderForProducts {
  productId: number;
  quantity: number;
}
export interface OrderForServices {
  serviceId: number;
}
