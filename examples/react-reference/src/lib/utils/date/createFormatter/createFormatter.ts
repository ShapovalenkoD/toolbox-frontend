const formatterCache = new Map<string, Intl.DateTimeFormat>();

const DefaultOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

export const createFormatter = (
  options: Intl.DateTimeFormatOptions = DefaultOptions,
  locale = "ru-RU",
): Intl.DateTimeFormat => {
  const optionsKey = JSON.stringify([
    locale,
    Object.entries(options).sort(([left], [right]) => {
      return left.localeCompare(right);
    }),
  ]);
  let formatter = formatterCache.get(optionsKey);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(optionsKey, formatter);
  }

  return formatter;
};
