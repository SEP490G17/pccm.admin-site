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

  reset (){
    this.totalElement = 0;
    this.skip = 0;
    this.searchTerm = '';
    this.filter = undefined;
    this.fromDate = null;
    this.toDate = null;
  }
}

export class ProductPageParams extends PageParams {
  courtCluster?: number;
  category?: number;

  reset(){
    super.reset();
    this.category = undefined;
    this.courtCluster = undefined;
  }
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

  reset() {
    super.reset();
    this.courtClusterId = undefined;
    this.courtId = undefined;
    this.status = undefined;
  }

}

export class BookingTodayPageParams extends PageParams {
  category?: number;
  status?: BookingStatus;
}
