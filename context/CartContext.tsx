import React, { createContext, useContext, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: any;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQty: (id: string, change: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ Add item or increase qty if exists
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ✅ Update quantity (increment/decrement)
  const updateQty = (id: string, change: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + change;
            // if decrement results in 0, remove it later
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // remove items with 0 qty
    });
  };

  // ✅ Remove a specific item completely
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Clear entire cart
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Safe custom hook for context usage
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
