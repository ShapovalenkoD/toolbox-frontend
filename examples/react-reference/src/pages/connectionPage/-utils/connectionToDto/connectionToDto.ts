import type { ConnectWorkspaceRequestDto } from "@/services";

import type { ConnectionFormValues } from "../../ConnectionPage.interface";

export const connectionToDto = (values: ConnectionFormValues): ConnectWorkspaceRequestDto => {
  return {
    access_key: values.accessKey,
    connection_name: values.name.trim(),
  };
};
