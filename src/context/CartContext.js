import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from local storage when app starts
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  };

  const saveCart = async (cartData) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartData));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => prevCart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkout = async (shippingInfo) => {
    try {
      setLoading(true);
      // Construct payload according to backend expectations
      const payload = {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
        total_amount: getCartTotal(),
        shipping_address: shippingInfo.address,
        // add other required fields like payment method, etc.
      };
      
      const response = await api.post('/orders', payload);
      
      if (response.data.ok || response.data.success) {
        clearCart();
        return { success: true, orderId: response.data.orderId || response.data.id };
      }
      return { success: false, error: 'Checkout failed on server' };
    } catch (error) {
      console.error('Checkout error:', error);
      return { success: false, error: error.response?.data?.message || 'Checkout failed' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        getCartTotal,
        checkout,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
