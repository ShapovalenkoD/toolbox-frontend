export const getDate = (value: unknown): Date | undefined => {
  if (!(value instanceof Date) && typeof value !== "string") {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isFinite(date.getTime()) ? date : undefined;
};
