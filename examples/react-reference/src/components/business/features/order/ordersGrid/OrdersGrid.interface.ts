/** Строка таблицы заказов — локальное представление feature, а не DTO. */
export interface OrderRow {
  id: string;
  number: string;
  status: string;
  total: string;
  createdAt: string;
}
