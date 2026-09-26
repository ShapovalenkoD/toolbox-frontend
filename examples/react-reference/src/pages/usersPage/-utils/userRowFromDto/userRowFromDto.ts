import { formatPhone } from "@/lib/business";
import { formatDate } from "@/lib/utils";
import type { UserDto } from "@/services";

import type { UserRow } from "../../UsersPage.interface";

export const userRowFromDto = (dto: UserDto): UserRow => {
  return {
    createdAt: formatDate(dto.created_at),
    email: dto.email,
    id: dto.id,
    name: dto.full_name,
    phone: dto.phone ? formatPhone(dto.phone) : "—",
  };
};
