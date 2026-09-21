import { z } from "zod";

export const ConnectionFormSchema = z.object({
  accessKey: z.string().min(4, "Введите код доступа — не менее четырёх символов."),
  name: z.string().trim().min(2, "Введите хотя бы два символа.").max(60, "Не больше 60 символов."),
});
