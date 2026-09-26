export interface PaginationProps {
  className?: string;
  /** Текущая страница, начиная с 1. Значение вне диапазона приводится к границе. */
  page: number;
  pageSize: number;
  total: number;
  /** Сколько соседних номеров показывать слева и справа от текущей страницы. */
  siblingCount?: number;
  onPageChange: (page: number) => void;
}

export type PaginationItem = { type: "page"; page: number } | { type: "ellipsis"; key: string };

export interface UsePaginationItemsProps {
  currentPage: number;
  pageCount: number;
  siblingCount: number;
}
