const isEnabled = (value: string | undefined, fallback: boolean): boolean => {
  return value === undefined ? fallback : value === "true";
};

/** Булевы feature flags с дефолтами. Читаются только здесь. */
export const Features = {
  ordersPageSizeSelect: isEnabled(import.meta.env.VITE_FEATURE_ORDERS_PAGE_SIZE, true),
} as const;
