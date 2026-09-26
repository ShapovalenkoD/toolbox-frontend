import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createPreferencesSlice } from "./preferences";
import type { Store } from "./store.interface";

export const useStore = create<Store>()(
  devtools(
    immer((...args) => ({
      ...createPreferencesSlice(...args),
    })),
  ),
);
