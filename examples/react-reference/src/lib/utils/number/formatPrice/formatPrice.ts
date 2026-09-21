import { createFormatterNumber } from "../createFormatterNumber";

const DefaultOptions: Intl.NumberFormatOptions = {
  currency: "RUB",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
};

export const formatPrice = (
  value?: unknown,
  options: Intl.NumberFormatOptions = DefaultOptions,
  locale = "ru-RU",
): string => {
  if (typeof value !== "number" && typeof value !== "string") {
    return "";
  }

  if (typeof value === "string" && value.trim() === "") {
    return "";
  }

  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "";
  }

  return createFormatterNumber(options, locale).format(price);
};
