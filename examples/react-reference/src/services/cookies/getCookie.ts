import type { CookieMap, CookieNames } from "./cookies.interface";
import { CookieSchemas } from "./cookies.schema";

export const getCookie = <Key extends CookieNames>(name: Key): CookieMap[Key] | undefined => {
  if (typeof document === "undefined") {
    return undefined;
  }

  const prefix = `${encodeURIComponent(name)}=`;
  const item = document.cookie.split("; ").find((part) => part.startsWith(prefix));

  if (!item) {
    return undefined;
  }

  const result = CookieSchemas[name].safeParse(decodeURIComponent(item.slice(prefix.length)));

  return result.success ? result.data : undefined;
};
