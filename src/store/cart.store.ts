import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  image_url: string | null;
  price: number;
  finalPrice: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const computeTotals = (items: CartItem[]) => ({
  totalAmount: items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0),
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      totalItems: 0,

      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        let updated: CartItem[];

        if (existing) {
          const newQty = Math.min(existing.quantity + 1, product.stock);
          updated = items.map((i) =>
            i.id === product.id ? { ...i, quantity: newQty, finalPrice: product.finalPrice } : i
          );
        } else {
          updated = [...items, { ...product, quantity: 1 }];
        }

        set({ items: updated, ...computeTotals(updated) });
      },

      removeItem: (id) => {
        const updated = get().items.filter((i) => i.id !== id);
        set({ items: updated, ...computeTotals(updated) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const updated = get().items.map((i) => {
          if (i.id !== id) return i;
          return { ...i, quantity: Math.min(quantity, i.stock) };
        });
        set({ items: updated, ...computeTotals(updated) });
      },

      clearCart: () => set({ items: [], totalAmount: 0, totalItems: 0 }),
    }),
    {
      name: 'crackers-cart',
    }
  )
);
