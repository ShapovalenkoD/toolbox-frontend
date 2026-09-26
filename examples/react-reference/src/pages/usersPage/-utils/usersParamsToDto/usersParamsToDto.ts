import type { UsersListRequestDto } from "@/services";

import type { UsersFilter } from "../../UsersPage.interface";

export const usersParamsToDto = (filter: UsersFilter, pageSize: number): UsersListRequestDto => {
  const search = filter.search.trim();

  return {
    page: filter.page,
    page_size: pageSize,
    ...(search ? { search } : {}),
  };
};
