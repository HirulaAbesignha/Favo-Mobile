import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  _id: string;
  itemName: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const savedCart = await AsyncStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  };

  const saveCart = async (newCart: CartItem[]) => {
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      let nextCart;
      if (existing) {
        nextCart = prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        nextCart = [...prev, { ...item, quantity: 1 }];
      }
      saveCart(nextCart);
      return nextCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const nextCart = prev.filter((i) => i._id !== id);
      saveCart(nextCart);
      return nextCart;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => {
      const nextCart = prev.map((i) =>
        i._id === id ? { ...i, quantity } : i
      );
      saveCart(nextCart);
      return nextCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
