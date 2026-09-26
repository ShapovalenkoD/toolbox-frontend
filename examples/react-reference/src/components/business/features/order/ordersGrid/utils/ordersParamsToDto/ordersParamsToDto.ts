import type { DataGridParams } from "@/components/business/patterns";
import type { OrdersListRequestDto } from "@/services";

import { OrderSortFields } from "../../OrdersGrid.constants";
import type { OrderRow } from "../../OrdersGrid.interface";

const isOrderRowKey = (id: string): id is keyof OrderRow => {
  return id in OrderSortFields;
};

export const ordersParamsToDto = (params: DataGridParams): OrdersListRequestDto => {
  const [sort] = params.sorting;
  const field = sort && isOrderRowKey(sort.id) ? OrderSortFields[sort.id] : undefined;

  return {
    page: params.page,
    page_size: params.pageSize,
    ...(field ? { sort: sort?.desc ? `-${field}` : field } : {}),
  };
};
