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
  topStaffs: string[];
  TopProducts: string[];
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
