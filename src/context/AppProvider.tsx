import React, { ReactNode } from 'react';
import { PricingProvider } from './PricingContext';
import { CartProvider } from './CartContext';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Combined provider that wraps the entire app with all context providers
 * This ensures all components have access to pricing and cart state
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <PricingProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </PricingProvider>
  );
};