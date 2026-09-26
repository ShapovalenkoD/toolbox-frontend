import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { HttpClient } from "../httpClient";

import type { UsersListRequestDto, UsersListResponseDto } from "./user.interface";

/** Ключи домена: от общего к частному, чтобы инвалидировать весь домен или один список. */
export const UserQueryKeys = {
  all: ["users"] as const,
  list: (params: UsersListRequestDto) => [...UserQueryKeys.all, "list", params] as const,
};

export const useUsers = (params: UsersListRequestDto) =>
  useQuery({
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }): Promise<UsersListResponseDto> => {
      const response = await HttpClient.get<UsersListResponseDto>("/users", { params, signal });

      return response.data;
    },
    queryKey: UserQueryKeys.list(params),
  });
