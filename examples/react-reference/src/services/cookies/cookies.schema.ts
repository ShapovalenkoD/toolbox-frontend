import { z } from "zod";

import type { CookieMap, CookieNames } from "./cookies.interface";

export const CookieSchemas: {
  [Key in CookieNames]: z.ZodType<Exclude<CookieMap[Key], undefined>>;
} = { sidebar_state: z.enum(["open", "closed"]) };
