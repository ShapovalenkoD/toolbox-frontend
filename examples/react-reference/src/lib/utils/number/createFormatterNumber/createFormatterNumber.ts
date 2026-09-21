const formatterCache = new Map<string, Intl.NumberFormat>();

export const createFormatterNumber = (
  options: Intl.NumberFormatOptions,
  locale: string,
): Intl.NumberFormat => {
  const optionsKey = JSON.stringify([
    locale,
    Object.entries(options).sort(([left], [right]) => {
      return left.localeCompare(right);
    }),
  ]);
  let formatter = formatterCache.get(optionsKey);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    formatterCache.set(optionsKey, formatter);
  }

  return formatter;
};
