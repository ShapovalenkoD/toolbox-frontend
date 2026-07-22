const formatterCache = new Map<string, Intl.DateTimeFormat>();

const defaultOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

export const createFormatter = (
  options: Intl.DateTimeFormatOptions = defaultOptions,
  locale: string = "ru-RU",
) => {
  const optionsKey = JSON.stringify({ locale, ...options });
  let formatter = formatterCache.get(optionsKey);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(optionsKey, formatter);
  }

  return formatter;
};

const isInstanceofDate = (value: unknown): value is Date => {
  return value instanceof Date;
};

const getDate = (date?: unknown) => {
  const isValidDate = isInstanceofDate(date);

  if (!date || (typeof date !== "string" && !isValidDate)) {
    return undefined;
  }

  return isValidDate ? date : new Date(date);
};

export const formatDate = (
  date?: unknown,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
) => {
  const innerDate = getDate(date);

  if (!innerDate) {
    return "";
  }

  return createFormatter(options, locale).format(innerDate);
};

export const formatDateToParts = (
  date?: unknown,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
) => {
  const innerDate = getDate(date);

  if (!innerDate) {
    return "";
  }

  return createFormatter(options, locale).formatToParts(innerDate);
};

export function formatTime(seconds: number): string;
export function formatTime(date: unknown): string;
export function formatTime(input: number | unknown): string {
  if (typeof input === "number") {
    const mins = Math.floor(input / 60);
    const secs = input % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const date = getDate(input);

  if (!date) {
    return "";
  }

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
