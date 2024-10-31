import { Product } from './product.model';
import { Staff } from './staff.model';

export interface FilterData {
  date: string;
  totalAmount: number;
  totalBooking: number;
  totalImportFee: number;
}

export interface DataTotal {
  totalCourtClusters: string;
  totalCourts: number;
  totalUsers: number;
  totalStaff: number;
}

export interface DataExpend {
  totalProductExpenditure: number;
  totalStaffExpenditure: number;
}

export interface DataTop {
  topStaffs: Staff[];
  topProducts: Product[];
}

export class FilterDataDTO {
  year: string = '';
  month: string = '';
  courtClusterId: number = 0;

  constructor(data?: Partial<FilterDataDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
