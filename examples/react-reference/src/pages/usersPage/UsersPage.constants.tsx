import type { TableColumn } from "@/components/ui";

import type { UserRow } from "./UsersPage.interface";

export const UsersColumns: TableColumn<UserRow>[] = [
  { accessorKey: "name", header: "Имя" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Телефон" },
  { accessorKey: "createdAt", header: "Зарегистрирован" },
];

export const SEARCH_DEBOUNCE_MS = 300;
