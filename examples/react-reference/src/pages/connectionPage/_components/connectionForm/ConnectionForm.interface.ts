import type { ConnectionFormValues } from "../../ConnectionPage.interface";

export interface ConnectionFormProps {
  error?: string;
  pending: boolean;
  onConnect: (values: ConnectionFormValues) => Promise<void>;
}
