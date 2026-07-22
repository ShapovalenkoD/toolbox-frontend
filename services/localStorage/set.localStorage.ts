import type { SetLocalStorageProps } from "./localStorage.interface";

export const setLocalStorage = (props: SetLocalStorageProps) => {
  const { name, value } = props;

  if (typeof window !== "undefined") {
    if (!name) {
      return;
    }

    localStorage.setItem(name, value);
  }

  return;
};
