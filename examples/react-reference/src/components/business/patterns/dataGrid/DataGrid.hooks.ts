import type { RowData } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import type { DataGridState, UseDataGridDataProps } from "./DataGrid.interface";

/** Загружает страницу по переданной операции; ответ устаревшего запроса отбрасывается. */
export const useDataGridData = <Row extends RowData>(
  props: UseDataGridDataProps<Row>,
): DataGridState<Row> => {
  const { loadData, query } = props;

  const [state, setState] = useState<DataGridState<Row>>({
    result: { items: [], total: 0 },
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();

    setState((previous) => ({ ...previous, status: "loading" }));

    loadData({
      page: query.page,
      pageSize: query.pageSize,
      signal: controller.signal,
      sorting: query.sorting,
    })
      .then((result) => {
        if (!controller.signal.aborted) {
          setState({ result, status: "success" });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState((previous) => ({ ...previous, status: "error" }));
        }
      });

    return () => {
      controller.abort();
    };
  }, [loadData, query]);

  return state;
};
