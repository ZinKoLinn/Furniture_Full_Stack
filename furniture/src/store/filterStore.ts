import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

interface filterState {
  category: string[];
  type: string[];
}

interface filterAction {
  setFilter: (category: string[], type: string[]) => void;
  clearFilter: () => void;
}

const initialState = {
  category: [],
  type: [],
};

export const useFilterStore = create<filterState & filterAction>()(
  persist(
    immer((set) => ({
      ...initialState,

      setFilter: (category, type) =>
        set((state) => {
          ((state.category = category), (state.type = type));
        }),

      clearFilter: () => set(initialState),
    })),
    {
      name: "filter-product",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
