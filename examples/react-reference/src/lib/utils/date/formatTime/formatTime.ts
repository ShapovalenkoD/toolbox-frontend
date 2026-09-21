import { getDate } from "../getDate";

export const formatTime = (input: unknown): string => {
  if (typeof input === "number") {
    if (!Number.isFinite(input) || input < 0) {
      return "";
    }

    const seconds = Math.floor(input);
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  }

  const date = getDate(input);

  if (!date) {
    return "";
  }

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
