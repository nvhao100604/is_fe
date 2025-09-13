export interface PageDTO<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const tempData = {
  content: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0
}