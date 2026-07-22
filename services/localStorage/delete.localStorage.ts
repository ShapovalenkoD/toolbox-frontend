import type { DeleteLocalStorageProps } from "./localStorage.interface";

export const deleteLocalStorage = (name: DeleteLocalStorageProps) => {
  if (typeof window !== "undefined") {
    if (!name) {
      return;
    }

    localStorage.removeItem(name);
  }

  return undefined;
};
