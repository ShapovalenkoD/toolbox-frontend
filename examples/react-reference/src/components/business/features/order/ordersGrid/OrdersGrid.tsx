import { useCallback } from "react";

import { Features } from "@config";
import { DataGrid, type DataGridParams, type DataGridResult } from "@/components/business/patterns";
import { PageSizeOptions } from "@/constants";
import { getOrders } from "@/services";
import { useStore } from "@/store";

import { OrdersGridColumns } from "./OrdersGrid.constants";
import type { OrderRow } from "./OrdersGrid.interface";
import { orderRowFromDto, ordersParamsToDto } from "./utils";

/** Таблица заказов: подключает сервис и store, загрузкой и навигацией управляет DataGrid. */
export const OrdersGrid = () => {
  const ordersPageSize = useStore((store) => store.preferences.ordersPageSize);
  const setOrdersPageSize = useStore((store) => store.preferences.setOrdersPageSize);

  // DataGrid перезапускает загрузку при смене ссылки на loadData.
  const loadOrders = useCallback(
    async (params: DataGridParams): Promise<DataGridResult<OrderRow>> => {
      const dto = await getOrders(ordersParamsToDto(params), params.signal);

      return { items: dto.items.map(orderRowFromDto), total: dto.total };
    },
    [],
  );

  const getOrderRowId = useCallback((row: OrderRow) => row.id, []);

  return (
    <DataGrid
      columns={OrdersGridColumns}
      defaultPageSize={ordersPageSize}
      emptyText="Заказов пока нет"
      errorText="Не удалось загрузить заказы."
      getRowId={getOrderRowId}
      loadData={loadOrders}
      onPageSizeChange={setOrdersPageSize}
      pageSizeOptions={Features.ordersPageSizeSelect ? PageSizeOptions : undefined}
    />
  );
};
