/** Российский номер из 11 цифр: "79991234567" → "+7 999 123-45-67". Иной ввод возвращается как есть. */
export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 11 || !["7", "8"].includes(digits.charAt(0))) {
    return value;
  }

  return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
};
