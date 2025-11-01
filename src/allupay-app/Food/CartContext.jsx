import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                (cartItem) => cartItem.id === item.id
            );

            if (existingItemIndex > -1) {
                // Item already in cart, update quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // New item, add to cart
                return [...prevItems, { ...item, quantity }];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ).filter(item => item.quantity > 0); // Remove if quantity drops to 0
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);
    const getTotalPrice = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);