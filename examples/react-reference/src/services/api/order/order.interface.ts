export type OrderStatusDto = "new" | "paid" | "cancelled";

export interface OrderDto {
  id: string;
  number: string;
  total_cents: number;
  status: OrderStatusDto;
  created_at: string;
}

export interface OrdersListRequestDto {
  page: number;
  page_size: number;
  /** Поле сортировки; минус означает обратный порядок: "-created_at". */
  sort?: string;
}

export interface OrdersListResponseDto {
  items: OrderDto[];
  total: number;
}
