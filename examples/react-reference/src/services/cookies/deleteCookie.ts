import type { DeleteCookieProps } from "./cookies.interface";

export const deleteCookie = (name: DeleteCookieProps): void => {
  if (typeof document === "undefined") {
    return;
  }

  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API асинхронный, а сервис предоставляет синхронный доступ.
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0`;
};
