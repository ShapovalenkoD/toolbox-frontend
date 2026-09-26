export interface TableRowMock {
  id: string;
  name: string;
  city: string;
  amount: string;
}

const Names = ["Анна Смирнова", "Иван Петров", "Мария Кузнецова", "Олег Соколов", "Дарья Волкова"];
const Cities = ["Москва", "Казань", "Самара", "Пермь"];

/** Детерминированные строки для stories таблиц: одинаковый набор при каждом вызове. */
export const createTableRowsMock = (count: number): TableRowMock[] => {
  return Array.from({ length: count }, (_, index) => ({
    amount: `${(index + 1) * 1250} ₽`,
    city: Cities[index % Cities.length] ?? "",
    id: `row-${index + 1}`,
    name: Names[index % Names.length] ?? "",
  }));
};
