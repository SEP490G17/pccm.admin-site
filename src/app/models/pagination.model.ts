export interface PaginationModel<T> {
  pageSize: number;
  count: number;
  data: T[];
}
