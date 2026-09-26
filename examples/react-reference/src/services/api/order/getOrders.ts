import { HttpClient } from "../httpClient";

import type { OrdersListRequestDto, OrdersListResponseDto } from "./order.interface";

/** Обычный async-метод: его можно передать в pattern как операцию, в отличие от query-хука. */
export const getOrders = async (
  params: OrdersListRequestDto,
  signal?: AbortSignal,
): Promise<OrdersListResponseDto> => {
  const response = await HttpClient.get<OrdersListResponseDto>("/orders", { params, signal });

  return response.data;
};
