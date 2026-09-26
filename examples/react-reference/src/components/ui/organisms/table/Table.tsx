import { type RowData, type SortingState, useTable } from "@tanstack/react-table";
import { clsx } from "clsx";

import { TableFeatureSet } from "./Table.constants";
import type { TableProps } from "./Table.interface";

import styles from "./table.module.css";

const AriaSort = { asc: "ascending", desc: "descending" } as const;
const SortIcon = { asc: "↑", desc: "↓" } as const;
const EmptySorting: SortingState = [];

export const Table = <Row extends RowData>(props: TableProps<Row>) => {
  const {
    caption,
    className,
    columns,
    data,
    emptyText = "Нет данных",
    getRowId,
    isBusy = false,
    onSortingChange,
    sorting = EmptySorting,
  } = props;

  const table = useTable({
    columns,
    data,
    enableSorting: onSortingChange !== undefined,
    features: TableFeatureSet,
    getRowId,
    manualSorting: true,
    onSortingChange,
    state: { sorting },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className={clsx(styles.wrap, className)}>
      <table aria-busy={isBusy} className={styles.table}>
        {caption ? <caption className={styles.caption}>{caption}</caption> : null}

        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted();

                return (
                  <th
                    aria-sort={sortDirection ? AriaSort[sortDirection] : undefined}
                    className={styles.headCell}
                    key={header.id}
                    scope="col"
                  >
                    {header.column.getCanSort() ? (
                      <button
                        className={styles.sortButton}
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        <table.FlexRender header={header} />
                        <span aria-hidden="true">
                          {sortDirection ? SortIcon[sortDirection] : "↕"}
                        </span>
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => (
                  <td className={styles.cell} key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
