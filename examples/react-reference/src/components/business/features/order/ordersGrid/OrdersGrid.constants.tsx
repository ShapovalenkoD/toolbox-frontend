import type { TableColumn } from "@/components/ui";
import type { OrderStatusDto } from "@/services";

import type { OrderRow } from "./OrdersGrid.interface";

export const OrderStatusLabels: Record<OrderStatusDto, string> = {
  cancelled: "Отменён",
  new: "Новый",
  paid: "Оплачен",
};

/** Колонка таблицы → поле сортировки API. Колонки без записи не сортируются. */
export const OrderSortFields: Partial<Record<keyof OrderRow, string>> = {
  createdAt: "created_at",
  number: "number",
  total: "total_cents",
};

export const OrdersGridColumns: TableColumn<OrderRow>[] = [
  { accessorKey: "number", header: "Номер" },
  { accessorKey: "status", enableSorting: false, header: "Статус" },
  { accessorKey: "total", header: "Сумма" },
  { accessorKey: "createdAt", header: "Создан" },
];
