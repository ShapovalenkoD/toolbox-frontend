import type { SetLocalStorageProps } from "./localStorage.interface";

export const setLocalStorage = (props: SetLocalStorageProps): void => {
  const { name, value } = props;

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(name, value);
};
