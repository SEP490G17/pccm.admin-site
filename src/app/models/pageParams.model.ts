import { BookingStatus } from './booking.model';

export interface IPageParams {
  pageIndex?: number;
  skip?: number;
  pageSize: number;
  totalPages?: number;
  totalElement: number;
  searchTerm?: string;
  sort?: string;
  filter?: string;
}

export class PageParams implements IPageParams {
  pageIndex?: number;
  skip?: number = 0;
  pageSize: number = 10;
  totalPages?: number;
  totalElement: number = 0;
  searchTerm?: string;
  sort?: string;
  filter?: string;
  fromDate?: string | null;
  toDate?: string | null;

  clearLazyPage = () => {
    this.totalElement = 0;
    this.skip = 0;
  };
}

export class ProductPageParams extends PageParams {
  courtCluster?: number;
  category?: number;
}

export class BannerPageParams extends PageParams {
  status?: string;
  category?: string;
}

export class ProductLogPageParams extends PageParams {
  courtCluster?: number;
  LogType?: number;
}

export class ServiceLogPageParams extends PageParams {
  courtCluster?: number;
  LogType?: number;
}

export class BookingPageParams extends PageParams {
  courtClusterId?: number;
  courtId?: number;
  status?: number;
}

export class BookingTodayPageParams extends PageParams {
  category?: number;
  status?: BookingStatus;
}
