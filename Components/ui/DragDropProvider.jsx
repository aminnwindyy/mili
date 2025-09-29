import React, { createContext, useContext, useState } from 'react';

const DragDropCartContext = createContext();

export const useDragDropCart = () => {
  const context = useContext(DragDropCartContext);
  if (!context) {
    throw new Error('useDragDropCart must be used within DragDropProvider');
  }
  return context;
};

export default function DragDropProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (property) => {
    const existingItem = cartItems.find(item => item.id === property.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === property.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...property, quantity: 1, investment_amount: property.token_price }]);
    }
    playSound('add-to-cart');
  };

  const removeFromCart = (propertyId) => {
    setCartItems(cartItems.filter(item => item.id !== propertyId));
    playSound('remove');
  };

  const updateCartItem = (propertyId, updates) => {
    setCartItems(cartItems.map(item => 
      item.id === propertyId 
        ? { ...item, ...updates }
        : item
    ));
  };

  const playSound = (soundType) => {
    // Check if user has sound enabled
    const soundEnabled = localStorage.getItem('sound_effects') !== 'false';
    if (!soundEnabled) return;

    try {
      const audio = new Audio();
      switch(soundType) {
        case 'add-to-cart':
          // Simple beep sound for add to cart
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+T2u2IZBzqTz+3ScisBJnja8N2QOAYbabz656NDE...';
          break;
        case 'success':
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+T2u2IZBzqTz+3ScisBJnja8N2QOAYbabz656NDE...';
          break;
        case 'remove':
          audio.src = 'data:audio/wav;base64,UklGRk4EAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSoEAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+T2u2IZBzqT...';
          break;
        default:
          return;
      }
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore play errors
    } catch (error) {
      // Sound failed, continue silently
    }
  };

  const vibrateDevice = (pattern = [100]) => {
    const vibrationEnabled = localStorage.getItem('vibration') !== 'false';
    if (!vibrationEnabled) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const contextValue = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateCartItem,
    playSound,
    vibrateDevice
  };

  return (
    <DragDropCartContext.Provider value={contextValue}>
      {children}
    </DragDropCartContext.Provider>
  );
}