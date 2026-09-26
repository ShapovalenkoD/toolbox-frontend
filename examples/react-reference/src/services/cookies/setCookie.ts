import type { SetCookieProps } from "./cookies.interface";

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const setCookie = (props: SetCookieProps): void => {
  const { maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS, name, value } = props;

  if (typeof document === "undefined") {
    return;
  }

  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API асинхронный, а сервис предоставляет синхронный доступ.
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
};
