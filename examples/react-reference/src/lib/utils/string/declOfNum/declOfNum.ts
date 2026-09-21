/** Формы для 1, 2 и 5: ["яблоко", "яблока", "яблок"]. Дробные числа используют вторую форму. */
export const declOfNum = (titles: readonly [string, string, string], value: number): string => {
  if (!Number.isFinite(value)) {
    return "";
  }

  const number = Math.abs(value);

  if (!Number.isInteger(number)) {
    return titles[1];
  }

  const lastTwo = number % 100;
  const last = number % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return titles[2];
  }

  if (last === 1) {
    return titles[0];
  }

  return last >= 2 && last <= 4 ? titles[1] : titles[2];
};
