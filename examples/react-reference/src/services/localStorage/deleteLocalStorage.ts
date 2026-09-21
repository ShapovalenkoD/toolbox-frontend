import type { DeleteLocalStorageProps } from "./localStorage.interface";

export const deleteLocalStorage = (name: DeleteLocalStorageProps): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(name);
};
