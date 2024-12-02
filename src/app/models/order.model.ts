import { PaymentStatus } from './payment.model';

export interface OrderOfBooking {
  id: number;
  createdAt: number;
  paymentStatus: PaymentStatus;
  isOpen: boolean;
  totalAmount: number;
}

export interface OrderModel {
  bookingId: number;
  id?: number;
  paymentStatus?: PaymentStatus;
  orderForProducts: ProductsForOrderCreate[];
  orderForServices: ServicesForOrderCreate[];
}

export interface ProductsForOrderCreate {
  productId: number;
  quantity: number;
}
export interface ServicesForOrderCreate {
  serviceId: number;
}


export interface OrderModelUpdate {
  bookingId: number;
  id?: number;
  paymentStatus?: PaymentStatus;
  orderForProducts: ProductForOrderDetails[];
  orderForServices: ServiceForOrderDetails[];
}


export interface ProductForOrderDetails{
  productId: number;
  quantity: number;
  productName:string;
  price: number;
  currPrice: number;
  totalPrice: number;
  currTotalPrice: number;
}

export interface ServiceForOrderDetails {
  serviceId: number;
  serviceName: string;
  price: number;
  currPrice: number;
  totalPrice?: number;
  currTotalPrice?: number;
}

