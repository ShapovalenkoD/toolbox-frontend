const formatterCache = new Map<string, Intl.NumberFormat>();

export const createFormatterNumber = (
  options: Intl.NumberFormatOptions,
  locale: string,
) => {
  const optionsKey = JSON.stringify({ locale, ...options });
  let formatter = formatterCache.get(optionsKey);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    formatterCache.set(optionsKey, formatter);
  }

  return formatter;
};

const defaultOptions: Intl.NumberFormatOptions = {
  currency: "RUB",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
};

export const formatPrice = (
  price?: unknown,
  options: Intl.NumberFormatOptions = defaultOptions,
  locale: string = "ru-RU",
) => {
  if (Number.isNaN(Number(price))) {
    return "";
  }

  return createFormatterNumber(options, locale).format(Number(price));
};
