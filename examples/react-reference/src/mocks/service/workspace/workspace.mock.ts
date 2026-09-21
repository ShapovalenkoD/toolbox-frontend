import { delay, HttpResponse, http } from "msw";

import type { ConnectWorkspaceRequestDto, ConnectWorkspaceResponseDto } from "@/services";

export const WorkspaceHandlers = [
  http.post<never, ConnectWorkspaceRequestDto>(
    "/api/workspace/connections",
    async ({ request }) => {
      const dto = await request.json();

      await delay(700);

      if (dto.access_key !== "demo-access") {
        return HttpResponse.json({ message: "Invalid key" }, { status: 401 });
      }

      return HttpResponse.json<ConnectWorkspaceResponseDto>({
        connected_at: new Date().toISOString(),
        connection_id: "workspace-demo",
        connection_name: dto.connection_name,
      });
    },
  ),
];
