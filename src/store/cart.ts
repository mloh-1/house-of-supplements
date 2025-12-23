import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  variantInfo?: string;
  variantId?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variantInfo === item.variantInfo
        );

        if (existingItemIndex > -1) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += item.quantity;
          set({ items: newItems });
        } else {
          const id = `${item.productId}-${item.variantInfo || "default"}-${Date.now()}`;
          set({ items: [...items, { ...item, id }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.salePrice ?? item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
