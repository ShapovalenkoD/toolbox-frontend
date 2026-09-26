import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderDto } from "@/services";

import { OrderStatusLabels } from "../../OrdersGrid.constants";
import type { OrderRow } from "../../OrdersGrid.interface";

export const orderRowFromDto = (dto: OrderDto): OrderRow => {
  return {
    createdAt: formatDate(dto.created_at),
    id: dto.id,
    number: `№ ${dto.number}`,
    status: OrderStatusLabels[dto.status],
    total: formatPrice(dto.total_cents / 100),
  };
};
