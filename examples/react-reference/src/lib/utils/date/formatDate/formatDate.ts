import { createFormatter } from "../createFormatter";
import { getDate } from "../getDate";

export const formatDate = (
  value?: unknown,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): string => {
  const date = getDate(value);

  if (!date) {
    return "";
  }

  return createFormatter(options, locale).format(date);
};
