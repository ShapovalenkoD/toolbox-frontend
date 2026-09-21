import type { LocalStorageMap, LocalStorageNames } from "./localStorage.interface";
import { LocalStorageSchemas } from "./localStorage.schema";

export const getLocalStorage = <Key extends LocalStorageNames>(
  name: Key,
): LocalStorageMap[Key] | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const item = window.localStorage.getItem(name);

  if (item === null) {
    return undefined;
  }

  const result = LocalStorageSchemas[name].safeParse(item);

  return result.success ? result.data : undefined;
};
