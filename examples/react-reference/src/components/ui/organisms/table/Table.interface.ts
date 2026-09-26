import type { ColumnDef, OnChangeFn, RowData, SortingState } from "@tanstack/react-table";

import type { TableFeatureSet } from "./Table.constants";

// biome-ignore lint/suspicious/noExplicitAny: массив колонок TanStack Table содержит значения разных типов (TValue).
export type TableColumn<Row extends RowData> = ColumnDef<typeof TableFeatureSet, Row, any>;

export interface TableProps<Row extends RowData> {
  caption?: string;
  className?: string;
  columns: TableColumn<Row>[];
  /** Стабильная ссылка: новый массив на каждый рендер пересчитывает модели таблицы. */
  data: Row[];
  emptyText?: string;
  isBusy?: boolean;
  /** Сортировка управляется владельцем данных: таблица только сообщает о её изменении. */
  sorting?: SortingState;
  getRowId: (row: Row) => string;
  onSortingChange?: OnChangeFn<SortingState>;
}
