export interface PaginatedResults<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    page: number;
    pages: number;
  };
}
