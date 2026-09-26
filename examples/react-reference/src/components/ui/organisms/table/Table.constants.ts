import { rowSortingFeature, tableFeatures } from "@tanstack/react-table";

/** Фичи TanStack Table, которые поддерживает организм. Сортировка ручная: строки упорядочивает владелец данных. */
export const TableFeatureSet = tableFeatures({ rowSortingFeature });
