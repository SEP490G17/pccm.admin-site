export interface IPageParams {
  pageIndex?: number;
  skip?: number;
  pageSize: number;
  totalPages?: number;
  totalElement: number;
  searchTerm?: string;
  sort?: string;
}

export class PageParams implements IPageParams {
  pageIndex?: number;
  skip?: number;
  pageSize: number = 3;
  totalPages?: number;
  totalElement: number = 0;
  searchTerm?: string;
  sort?: string;

  clearLazyPage = () => {
    this.totalElement = 0;
    this.skip = 0;
  };
}
