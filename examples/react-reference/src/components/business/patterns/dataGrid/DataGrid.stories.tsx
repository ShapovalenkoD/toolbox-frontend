import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import type { TableColumn } from "@/components/ui";
import { createTableRowsMock, type TableRowMock } from "@/mocks";

import { DataGrid } from "./DataGrid";
import type { DataGridParams, DataGridResult } from "./DataGrid.interface";

const Columns: TableColumn<TableRowMock>[] = [
  { accessorKey: "name", header: "Имя" },
  { accessorKey: "city", enableSorting: false, header: "Город" },
  { accessorKey: "amount", header: "Сумма" },
];

const Rows = createTableRowsMock(47);

const getRowId = (row: TableRowMock) => row.id;

const wait = (ms: number, signal: AbortSignal) => {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
};

/** Управляемая операция вместо сервиса: pattern получает загрузку через props. */
const loadRows = async (params: DataGridParams): Promise<DataGridResult<TableRowMock>> => {
  await wait(500, params.signal);

  const [sort] = params.sorting;
  const sorted = sort
    ? [...Rows].sort((a, b) => {
        const key = sort.id === "amount" ? "amount" : "name";
        const order = a[key].localeCompare(b[key], "ru", { numeric: true });

        return sort.desc ? -order : order;
      })
    : Rows;
  const start = (params.page - 1) * params.pageSize;

  return { items: sorted.slice(start, start + params.pageSize), total: Rows.length };
};

const failRows = async (params: DataGridParams): Promise<DataGridResult<TableRowMock>> => {
  await wait(500, params.signal);

  throw new Error("Сервис недоступен");
};

const StoryMeta = {
  args: {
    columns: Columns,
    defaultPageSize: 10,
    getRowId,
    loadData: loadRows,
    onPageSizeChange: fn(),
    pageSizeOptions: [10, 20, 50],
  },
  argTypes: {
    columns: { control: false },
    getRowId: { control: false },
    loadData: { control: false },
  },
  component: DataGrid<TableRowMock>,
  parameters: {
    docs: {
      description: {
        component:
          "Объединяет Table и Pagination и управляет загрузкой через loadData из props. Конкретный сервис не импортирует.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Business/Patterns/DataGrid",
} satisfies Meta<typeof DataGrid<TableRowMock>>;

export default StoryMeta;

export const Default: StoryObj<typeof StoryMeta> = {};

export const LoadError: StoryObj<typeof StoryMeta> = {
  args: { loadData: failRows },
};

export const Empty: StoryObj<typeof StoryMeta> = {
  args: { loadData: async () => ({ items: [], total: 0 }) },
};
