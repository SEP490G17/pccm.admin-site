export interface orderProductDetails {
  productName: string;
  quantity: number;
  totalPrice: number;
}

export interface orderServiceDetails {
  serviceName: string;
  quantity: number;
  totalPrice: number;
}

export interface BookingDetails {
  courtName: string;
  hoursBooked: string;
  totalPrice: number;
}

export interface ExpenseDetails {
  id?: number;
  expenseName: string;
  totalPrice: number;
}

export interface ExpenseDto {
  expenseAt: string;
  courtClusterId: number;
  expenseInputDto: ExpenseDetails[];
}

export interface CourtClusterStatisticDetails {
  orderProductDetails: orderProductDetails[];
  bookingDetails: BookingDetails[];
  orderServiceDetails: orderServiceDetails[];
  expenseDetails: ExpenseDetails[];
}

export class RevenueDetails {
  orderProductDetails: orderProductDetails[] = [];
  bookingDetails: BookingDetails[] = [];
  orderServiceDetails: orderServiceDetails[] = [];
  expenseDetails: ExpenseDetails[] = [];
  date: string = '';
  courtClusterId: number = 0;

  constructor(data?: Partial<RevenueDetails>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class FilterCourtClusterStatisticDetailsDTO {
  date: string = '';
  courtClusterId: number = 0;

  constructor(data?: Partial<FilterCourtClusterStatisticDetailsDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class ExpenseDetailsDTO {
  expenseAt: string = '';
  courtClusterId: string = '';
  expenseInputDto: ExpenseDetails[] = [];

  constructor(data?: Partial<ExpenseDetailsDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
