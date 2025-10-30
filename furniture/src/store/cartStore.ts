import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  carts: CartItem[];
}

interface CartActions {
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  addItems: (item: CartItem) => void;
  updateItems: (id: number, quantity: number) => void;
  removeItems: (id: number) => void;
  clearCarts: () => void;
}

const initialState: CartState = {
  carts: [],
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      getTotalQuantity: () => {
        const { carts } = get();
        return carts.reduce((total, product) => total + product.quantity, 0);
      },

      getTotalPrice: () => {
        const { carts } = get();
        return carts.reduce(
          (total, product) => total + product.price * product.quantity,
          0,
        );
      },

      addItems: (item) =>
        set((state) => {
          const existingItem = state.carts.find((i) => i.id === item.id);
          if (existingItem) {
            existingItem.quantity = item.quantity || 1;
          } else state.carts.push({ ...item, quantity: item.quantity || 1 });
        }),

      updateItems: (id, quantity) =>
        set((state) => {
          const item = state.carts.find((i) => i.id === id);
          if (item) {
            item.quantity = quantity;
          }
        }),

      removeItems: (id) =>
        set((state) => {
          state.carts = state.carts.filter((item) => item.id !== id);
        }),

      clearCarts: () => set(initialState),
    })),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
