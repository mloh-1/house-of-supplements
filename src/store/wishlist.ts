import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  addedAt: Date;
}

interface UserWishlists {
  [userId: string]: WishlistItem[];
}

interface WishlistState {
  currentUserId: string | null;
  userWishlists: UserWishlists;
  setUser: (userId: string | null) => void;
  addItem: (item: Omit<WishlistItem, "id" | "addedAt">) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
  getItems: () => WishlistItem[];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      userWishlists: {},

      setUser: (userId) => {
        set({ currentUserId: userId });
      },

      getItems: () => {
        const { currentUserId, userWishlists } = get();
        if (!currentUserId) return [];
        return userWishlists[currentUserId] || [];
      },

      addItem: (item) => {
        const { currentUserId, userWishlists } = get();
        if (!currentUserId) return;

        const userItems = userWishlists[currentUserId] || [];
        const exists = userItems.some((i) => i.productId === item.productId);

        if (!exists) {
          const id = `wishlist-${item.productId}-${Date.now()}`;
          set({
            userWishlists: {
              ...userWishlists,
              [currentUserId]: [...userItems, { ...item, id, addedAt: new Date() }],
            },
          });
        }
      },

      removeItem: (productId) => {
        const { currentUserId, userWishlists } = get();
        if (!currentUserId) return;

        const userItems = userWishlists[currentUserId] || [];
        set({
          userWishlists: {
            ...userWishlists,
            [currentUserId]: userItems.filter((item) => item.productId !== productId),
          },
        });
      },

      isInWishlist: (productId) => {
        const { currentUserId, userWishlists } = get();
        if (!currentUserId) return false;
        const userItems = userWishlists[currentUserId] || [];
        return userItems.some((item) => item.productId === productId);
      },

      clearWishlist: () => {
        const { currentUserId, userWishlists } = get();
        if (!currentUserId) return;
        set({
          userWishlists: {
            ...userWishlists,
            [currentUserId]: [],
          },
        });
      },

      getItemCount: () => {
        const { currentUserId, userWishlists } = get();
        if (!currentUserId) return 0;
        const userItems = userWishlists[currentUserId] || [];
        return userItems.length;
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
