import type { StateCreator } from "zustand";

import type { PreferencesSlice } from "./preferences";

export type Store = PreferencesSlice;

export type StateCreatorSlice<T> = StateCreator<
  Store,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  T
>;
