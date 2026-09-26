/** Пользовательские настройки интерфейса: внутренняя модель, без DTO. */
export interface PreferencesSlice {
  preferences: {
    ordersPageSize: number;
    setOrdersPageSize: (pageSize: number) => void;
  };
}
