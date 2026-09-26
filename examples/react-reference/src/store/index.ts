// Индекс домена открывает slice-creator корневому store.ts; наружу — только хук и типы.
export type { PreferencesSlice } from "./preferences";
export * from "./store";
export type * from "./store.interface";
