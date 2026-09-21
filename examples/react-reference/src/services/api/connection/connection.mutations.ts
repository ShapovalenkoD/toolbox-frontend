import { useMutation } from "@tanstack/react-query";

import { HttpClient } from "../httpClient";

import type {
  ConnectWorkspaceRequestDto,
  ConnectWorkspaceResponseDto,
} from "./connection.interface";

export const useConnectWorkspace = () =>
  useMutation({
    mutationFn: async (dto: ConnectWorkspaceRequestDto): Promise<ConnectWorkspaceResponseDto> => {
      const response = await HttpClient.post<ConnectWorkspaceResponseDto>("/connections", dto);

      return response.data;
    },
    retry: false,
  });
