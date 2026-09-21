import { createFormatter } from "../createFormatter";
import { getDate } from "../getDate";

export const formatDateToParts = (
  value?: unknown,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): Intl.DateTimeFormatPart[] => {
  const date = getDate(value);

  if (!date) {
    return [];
  }

  return createFormatter(options, locale).formatToParts(date);
};
