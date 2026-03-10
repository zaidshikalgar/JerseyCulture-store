'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
const CART_STORAGE_KEY = 'jerseyculture-cart';
function loadCart() {
    if (typeof window === 'undefined')
        return [];
    try {
        const stored = sessionStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    catch {
        return [];
    }
}
const CartContext = createContext(undefined);
export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [hydrated, setHydrated] = useState(false);
    // Load cart from sessionStorage on mount
    useEffect(() => {
        setItems(loadCart());
        setHydrated(true);
    }, []);
    // Save cart to sessionStorage on every change
    useEffect(() => {
        if (hydrated) {
            sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);
    const addItem = useCallback((product, size, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id && item.size === size);
            if (existing) {
                return prev.map((item) => item.product.id === product.id && item.size === size
                    ? { ...item, quantity: item.quantity + quantity }
                    : item);
            }
            return [...prev, { product, size, quantity }];
        });
    }, []);
    const removeItem = useCallback((productId, size) => {
        setItems((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
    }, []);
    const updateQuantity = useCallback((productId, size, quantity) => {
        if (quantity < 1)
            return;
        setItems((prev) => prev.map((item) => item.product.id === productId && item.size === size
            ? { ...item, quantity }
            : item));
    }, []);
    const clearCart = useCallback(() => setItems([]), []);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return (<CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
        }}>
      {children}
    </CartContext.Provider>);
}
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
