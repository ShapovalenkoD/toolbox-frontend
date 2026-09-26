import { delay, HttpResponse, http } from "msw";

import type { UserDto, UsersListResponseDto } from "@/services";

const Names = ["Анна Смирнова", "Иван Петров", "Мария Кузнецова", "Олег Соколов", "Дарья Волкова"];

const createUsersMock = (count: number): UserDto[] => {
  return Array.from({ length: count }, (_, index) => ({
    created_at: new Date(Date.UTC(2026, 0, 1 + index)).toISOString(),
    email: `user${index + 1}@example.com`,
    full_name: `${Names[index % Names.length] ?? ""} ${index + 1}`,
    id: `user-${index + 1}`,
    phone: index % 3 === 0 ? null : `7999${String(1_000_000 + index).slice(-7)}`,
  }));
};

const Users = createUsersMock(64);

export const UsersHandlers = [
  http.get("/api/workspace/users", async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("page_size") ?? "20");
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const filtered = Users.filter((user) => user.full_name.toLowerCase().includes(search));
    const start = (page - 1) * pageSize;

    await delay(400);

    return HttpResponse.json<UsersListResponseDto>({
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
    });
  }),
];
