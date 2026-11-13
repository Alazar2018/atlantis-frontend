"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  cartCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
    setReady(true);
  }, []);

  // Save only after the stored cart has been read, so a reload does not wipe it
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, ready]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.size === item.size &&
        cartItem.color === item.color
    );

    if (existingItemIndex >= 0) {
      // Item already exists, update quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
      toast.success(`${item.name} quantity updated in cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      // New item, add to cart
      const newItem: CartItem = { ...item, quantity };
      setCartItems([...cartItems, newItem]);
      toast.success(`${quantity} x ${item.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    const item = cartItems.find(
      (item) =>
        item.id === id && item.size === size && item.color === color
    );
    const updatedItems = cartItems.filter(
      (item) =>
        !(item.id === id && item.size === size && item.color === color)
    );
    setCartItems(updatedItems);
    toast.success(`${item?.name || "Item"} removed from cart`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity < 1) {
      removeFromCart(id, size, color);
      return;
    }
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    );
    setCartItems(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

