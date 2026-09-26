import { useEffect, useState } from "react";

/** Возвращает значение, которое обновляется после паузы в изменениях. */
export const useDebounce = <Value>(value: Value, delayMs: number): Value => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [delayMs, value]);

  return debounced;
};
