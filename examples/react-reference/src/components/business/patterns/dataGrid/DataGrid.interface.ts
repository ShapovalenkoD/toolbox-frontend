import type { RowData, SortingState } from "@tanstack/react-table";

import type { TableColumn } from "@/components/ui";

/** Параметры, с которыми DataGrid вызывает loadData. Страницы начинаются с 1. */
export interface DataGridParams {
  page: number;
  pageSize: number;
  sorting: SortingState;
  signal: AbortSignal;
}

export interface DataGridResult<Row extends RowData> {
  items: Row[];
  total: number;
}

export interface DataGridProps<Row extends RowData> {
  columns: TableColumn<Row>[];
  defaultPageSize: number;
  emptyText?: string;
  errorText?: string;
  pageSizeOptions?: readonly number[];
  getRowId: (row: Row) => string;
  /** Операция загрузки. Должна быть стабильной ссылкой: её смена перезапускает загрузку. */
  loadData: (params: DataGridParams) => Promise<DataGridResult<Row>>;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataGridQuery {
  page: number;
  pageSize: number;
  sorting: SortingState;
  /** Увеличивается при повторе, чтобы перезапустить загрузку с теми же параметрами. */
  attempt: number;
}

export type DataGridStatus = "loading" | "error" | "success";

export interface DataGridState<Row extends RowData> {
  result: DataGridResult<Row>;
  status: DataGridStatus;
}

export interface UseDataGridDataProps<Row extends RowData> {
  loadData: DataGridProps<Row>["loadData"];
  query: DataGridQuery;
}
