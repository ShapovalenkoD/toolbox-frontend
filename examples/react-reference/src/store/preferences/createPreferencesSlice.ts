import { DEFAULT_PAGE_SIZE } from "@/constants";

import type { StateCreatorSlice } from "../store.interface";

import type { PreferencesSlice } from "./createPreferencesSlice.interface";

export const createPreferencesSlice: StateCreatorSlice<PreferencesSlice> = (set) => ({
  preferences: {
    ordersPageSize: DEFAULT_PAGE_SIZE,
    setOrdersPageSize: (pageSize) => {
      set(
        (state) => {
          state.preferences.ordersPageSize = pageSize;
        },
        false,
        "preferences/setOrdersPageSize",
      );
    },
  },
});
