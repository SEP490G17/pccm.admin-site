export interface OrderDetails {
  productName: string;
  quantity: number;
  totalPrice: number;
}

export interface BookingDetails {
  courtName: string;
  hoursBooked: string;
  totalPrice: number;
}

export interface CourtClusterStatisticDetails {
  orderDetails: OrderDetails[];
  bookingDetails: BookingDetails[];
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
