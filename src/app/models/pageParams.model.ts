export interface IPageParams {
  pageIndex: number;
  pageSize: number;
  totalPages?: number;
  totalElement?: number;
  searchTerm?: string;
  sort?: string;
}

export class PageParams implements IPageParams {
  pageIndex: number = 1;
  pageSize: number = 3;
  totalPages?: number;
  totalElement?: number;
  searchTerm?: string;
  sort?: string;
}
