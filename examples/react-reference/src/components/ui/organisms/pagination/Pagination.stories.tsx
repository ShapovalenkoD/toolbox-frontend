import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Pagination } from "./Pagination";
import type { PaginationProps } from "./Pagination.interface";

const StoryMeta = {
  args: { onPageChange: fn(), page: 4, pageSize: 100, siblingCount: 1, total: 1000 },
  argTypes: {
    page: { control: "number" },
    pageSize: { control: "number" },
    siblingCount: { control: "number" },
    total: { control: "number" },
  },
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          "Вычисляет окно страниц и сообщает выбранную через onPageChange. Данные не загружает.",
      },
    },
  },
  tags: ["autodocs"],
  title: "UI/Organisms/Pagination",
} satisfies Meta<typeof Pagination>;

export default StoryMeta;

export const Default: StoryObj<typeof StoryMeta> = {};

export const States: StoryObj<typeof StoryMeta> = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      <p>Первая страница</p>
      <Pagination {...args} page={1} />
      <p>Последняя страница</p>
      <Pagination {...args} page={10} />
      <p>Номер вне диапазона приводится к границе</p>
      <Pagination {...args} page={99} />
      <p>Одна страница — пагинация не показывается</p>
      <Pagination {...args} total={20} />
    </div>
  ),
};

const InteractivePagination = (props: PaginationProps) => {
  const [page, setPage] = useState(props.page);

  return <Pagination {...props} onPageChange={setPage} page={page} />;
};

export const Interactive: StoryObj<typeof StoryMeta> = {
  render: (args) => <InteractivePagination {...args} />,
};
