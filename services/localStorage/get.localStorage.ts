import type {
  LocalStorageMap,
  LocalStorageNames,
} from "./localStorage.interface";

export const getLocalStorage = <Key extends LocalStorageNames>(
  name: Key
): LocalStorageMap[Key] | undefined => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(name);

    if (!item) {
      return;
    }

    return item as LocalStorageMap[Key];
  }

  return undefined;
};
