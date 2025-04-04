'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type TToken = {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
  price: number;

  // category: string[];
  // exchange: string[];
};

export type TCartItem = {
  token: TToken;
  quantity: number;
};

type TCartContextValue = {
  cartItems: TCartItem[];
  addToCart: (token: TToken) => void;
  removeFromCart: (tokenId: string) => void;
  updateCartItemQuantity: (tokenId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  data: TToken[];
};

const CartContext = createContext<TCartContextValue>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  cartTotal: 0,
  cartCount: 0,
  data: []
});

export const useCart = () => {
  return useContext(CartContext);
};

type TProperties = {
  children: React.ReactNode;
};

export const CartProvider = ({ children }: TProperties) => {
  const [cartItems, setCartItems] = useState<TCartItem[]>([]);
  const [data, setData] = useState<TToken[]>([]);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const tokens = (await response.json()) as TToken[];
        setData(tokens);
      } catch (error) {
        console.error('CLIENT ERROR | Failed to fetch token data', error);
      }
    };

    fetchTokenData();
  }, []);

  const addToCart = (token: TToken) => {
    const existingCartItemIndex = cartItems.findIndex((item) => item.token.id === token.id);
    if (existingCartItemIndex !== -1) {
      const existingCartItem = cartItems[existingCartItemIndex];
      if (existingCartItem) {
        const updatedCartItem = {
          ...existingCartItem,
          quantity: (existingCartItem?.quantity ?? 0) + 1
        };
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingCartItemIndex] = updatedCartItem;
        setCartItems(updatedCartItems);
      }
    } else {
      setCartItems([...cartItems, { token, quantity: 1 }]);
    }
  };

  const removeFromCart = (tokenId: string) => {
    const updatedCartItems = cartItems.filter((item) => item.token.id !== tokenId);
    setCartItems(updatedCartItems);
  };

  const updateCartItemQuantity = (tokenId: string, quantity: number) => {
    const existingCartItemIndex = cartItems.findIndex((item) => item.token.id === tokenId);
    if (existingCartItemIndex !== -1) {
      const existingCartItem = cartItems[existingCartItemIndex];
      if (existingCartItem) {
        const updatedCartItem = {
          ...existingCartItem,
          quantity
        };
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingCartItemIndex] = updatedCartItem;
        setCartItems(updatedCartItems);
      }
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.token.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartTotal,
        cartCount,
        data
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
