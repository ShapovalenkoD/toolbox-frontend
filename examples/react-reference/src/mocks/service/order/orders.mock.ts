import { delay, HttpResponse, http } from "msw";

import type { OrderDto, OrderStatusDto, OrdersListResponseDto } from "@/services";

const Statuses: OrderStatusDto[] = ["new", "paid", "cancelled"];

const createOrdersMock = (count: number): OrderDto[] => {
  return Array.from({ length: count }, (_, index) => ({
    created_at: new Date(Date.UTC(2026, 5, 1 + index)).toISOString(),
    id: `order-${index + 1}`,
    number: String(10_000 + index),
    status: Statuses[index % Statuses.length] ?? "new",
    total_cents: ((index * 37) % 50) * 10_000 + 99_000,
  }));
};

const Orders = createOrdersMock(137);

const compareOrders = (field: string) => {
  return (a: OrderDto, b: OrderDto): number => {
    if (field === "total_cents") {
      return a.total_cents - b.total_cents;
    }

    return field === "number"
      ? a.number.localeCompare(b.number)
      : a.created_at.localeCompare(b.created_at);
  };
};

export const OrdersHandlers = [
  http.get("/api/workspace/orders", async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("page_size") ?? "20");
    const sort = url.searchParams.get("sort");
    const sorted = sort ? [...Orders].sort(compareOrders(sort.replace("-", ""))) : Orders;
    const ordered = sort?.startsWith("-") ? sorted.reverse() : sorted;
    const start = (page - 1) * pageSize;

    await delay(400);

    return HttpResponse.json<OrdersListResponseDto>({
      items: ordered.slice(start, start + pageSize),
      total: Orders.length,
    });
  }),
];
