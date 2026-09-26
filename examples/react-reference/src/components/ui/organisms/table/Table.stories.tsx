import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { fn } from "storybook/test";

import { createTableRowsMock, type TableRowMock } from "@/mocks";

import { Table } from "./Table";
import type { TableColumn, TableProps } from "./Table.interface";

const Columns: TableColumn<TableRowMock>[] = [
  { accessorKey: "name", header: "Имя" },
  { accessorKey: "city", enableSorting: false, header: "Город" },
  { accessorKey: "amount", header: "Сумма" },
];

const getRowId = (row: TableRowMock) => row.id;

const StoryMeta = {
  args: {
    caption: "Клиенты",
    columns: Columns,
    data: createTableRowsMock(5),
    getRowId,
    isBusy: false,
    onSortingChange: fn(),
    sorting: [{ desc: false, id: "name" }],
  },
  argTypes: {
    columns: { control: false },
    data: { control: "object" },
    getRowId: { control: false },
    isBusy: { control: "boolean" },
  },
  component: Table<TableRowMock>,
  parameters: {
    docs: {
      description: {
        component:
          "Отображает строки через TanStack Table. Сортировка управляется владельцем данных: таблица сообщает о ней через onSortingChange.",
      },
    },
  },
  tags: ["autodocs"],
  title: "UI/Organisms/Table",
} satisfies Meta<typeof Table<TableRowMock>>;

export default StoryMeta;

export const Default: StoryObj<typeof StoryMeta> = {};

export const States: StoryObj<typeof StoryMeta> = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <Table {...args} caption="Идёт обновление" isBusy />
      <Table {...args} caption="Пустой результат" data={[]} />
      <Table {...args} caption="Без сортировки" onSortingChange={undefined} />
    </div>
  ),
};

export const Overflow: StoryObj<typeof StoryMeta> = {
  args: { data: createTableRowsMock(30) },
};

const InteractiveTable = (props: TableProps<TableRowMock>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  return <Table {...props} onSortingChange={setSorting} sorting={sorting} />;
};

export const Interactive: StoryObj<typeof StoryMeta> = {
  render: (args) => <InteractiveTable {...args} />,
};
