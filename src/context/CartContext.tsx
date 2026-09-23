'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: MenuItem, selectedOption?: string) => void;
  removeFromCart: (menuItemId: string, selectedOption?: string) => void;
  updateQuantity: (menuItemId: string, delta: number, selectedOption?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  getItemQuantity: (menuItemId: string, selectedOption?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ott_cafe_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const addToCart = (menuItem: MenuItem, selectedOption?: string) => {
    if (!menuItem.isAvailable) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.menuItem.id === menuItem.id && ci.selectedOption === selectedOption
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            menuItem,
            quantity: 1,
            selectedOption,
            selectedPrice: menuItem.price,
          },
        ];
      }
    });
  };

  const removeFromCart = (menuItemId: string, selectedOption?: string) => {
    setItems((prev) =>
      prev.filter(
        (ci) => !(ci.menuItem.id === menuItemId && ci.selectedOption === selectedOption)
      )
    );
  };

  const updateQuantity = (menuItemId: string, delta: number, selectedOption?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.menuItem.id === menuItemId && ci.selectedOption === selectedOption
      );

      if (existingIndex === -1) {
        if (delta > 0) {
          // Cannot add without full menuItem, handled by addToCart
          return prev;
        }
        return prev;
      }

      const current = prev[existingIndex];
      const newQty = current.quantity + delta;

      if (newQty <= 0) {
        return prev.filter((_, idx) => idx !== existingIndex);
      }

      const next = [...prev];
      next[existingIndex] = {
        ...current,
        quantity: newQty,
      };
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (menuItemId: string, selectedOption?: string): number => {
    const item = items.find(
      (ci) => ci.menuItem.id === menuItemId && (!selectedOption || ci.selectedOption === selectedOption)
    );
    return item ? item.quantity : 0;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  const total = subtotal; // no arbitrary extra fees

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
