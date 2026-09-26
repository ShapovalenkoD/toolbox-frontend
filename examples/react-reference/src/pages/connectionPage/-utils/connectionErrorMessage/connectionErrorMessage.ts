import { ApiError } from "@/services";

export const connectionErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError && error.status === 401) {
    return "Код доступа не подошёл. Проверьте его и попробуйте снова.";
  }

  if (error instanceof ApiError && error.code === "TIMEOUT") {
    return "Сервис не успел ответить. Попробуйте подключиться ещё раз.";
  }

  return "Подключиться не удалось. Введённые данные сохранены — попробуйте ещё раз.";
};
