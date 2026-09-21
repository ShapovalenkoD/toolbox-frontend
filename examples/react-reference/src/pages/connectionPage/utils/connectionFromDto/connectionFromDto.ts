import { formatDate } from "@/lib/utils";
import type { ConnectWorkspaceResponseDto } from "@/services";

import type { Connection } from "../../ConnectionPage.interface";

export const connectionFromDto = (dto: ConnectWorkspaceResponseDto): Connection => {
  return {
    connectedAt: formatDate(dto.connected_at, { hour: "2-digit", minute: "2-digit" }),
    id: dto.connection_id,
    title: dto.connection_name,
  };
};
