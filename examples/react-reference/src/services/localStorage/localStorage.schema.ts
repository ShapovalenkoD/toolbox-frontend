import { z } from "zod";

import type { LocalStorageMap, LocalStorageNames } from "./localStorage.interface";

export const LocalStorageSchemas: {
  [Key in LocalStorageNames]: z.ZodType<Exclude<LocalStorageMap[Key], undefined>>;
} = { test: z.enum(["foo", "bar"]) };
