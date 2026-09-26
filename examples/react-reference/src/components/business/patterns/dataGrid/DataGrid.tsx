import type { OnChangeFn, RowData, SortingState } from "@tanstack/react-table";
import { type ChangeEvent, useEffect, useId, useState } from "react";

import { Pagination, Table } from "@/components/ui";

import { useDataGridData } from "./DataGrid.hooks";
import type { DataGridProps, DataGridQuery } from "./DataGrid.interface";

import styles from "./dataGrid.module.css";

export const DataGrid = <Row extends RowData>(props: DataGridProps<Row>) => {
  const {
    columns,
    defaultPageSize,
    emptyText = "Ничего не найдено",
    errorText = "Не удалось загрузить данные.",
    getRowId,
    loadData,
    onPageSizeChange,
    pageSizeOptions,
  } = props;

  const pageSizeId = useId();

  const [query, setQuery] = useState<DataGridQuery>({
    attempt: 0,
    page: 1,
    pageSize: defaultPageSize,
    sorting: [],
  });

  const { result, status } = useDataGridData({ loadData, query });

  const pageCount = Math.max(1, Math.ceil(result.total / query.pageSize));

  // После уменьшения общего количества номер страницы остаётся допустимым.
  useEffect(() => {
    if (status === "success" && query.page > pageCount) {
      setQuery((previous) => ({ ...previous, page: pageCount }));
    }
  }, [pageCount, query.page, status]);

  const handlePageChange = (page: number) => {
    setQuery((previous) => ({ ...previous, page }));
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setQuery((previous) => ({
      ...previous,
      page: 1,
      sorting: typeof updater === "function" ? updater(previous.sorting) : updater,
    }));
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const pageSize = Number(event.target.value);

    setQuery((previous) => ({ ...previous, page: 1, pageSize }));
    onPageSizeChange?.(pageSize);
  };

  const handleRetry = () => {
    setQuery((previous) => ({ ...previous, attempt: previous.attempt + 1 }));
  };

  return (
    <section className={styles.grid}>
      {status === "error" ? (
        <div className={styles.error} role="alert">
          <span>{errorText}</span>
          <button
            className="button button-size-sm button-variant-secondary"
            onClick={handleRetry}
            type="button"
          >
            Повторить
          </button>
        </div>
      ) : null}

      <Table
        columns={columns}
        data={result.items}
        emptyText={status === "loading" ? "Загрузка…" : emptyText}
        getRowId={getRowId}
        isBusy={status === "loading"}
        onSortingChange={handleSortingChange}
        sorting={query.sorting}
      />

      <footer className={styles.footer}>
        <Pagination
          onPageChange={handlePageChange}
          page={query.page}
          pageSize={query.pageSize}
          total={result.total}
        />

        {pageSizeOptions ? (
          <div className={styles.pageSize}>
            <label className="label" htmlFor={pageSizeId}>
              На странице
            </label>
            <select
              className="input"
              id={pageSizeId}
              onChange={handlePageSizeChange}
              value={query.pageSize}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </footer>
    </section>
  );
};
