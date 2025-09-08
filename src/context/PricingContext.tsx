import React, { createContext, useContext, ReactNode } from 'react';
import { usePricingData } from '@/hooks/usePricingQueries';
import { CurrencyOption, PriceData } from '@/services/api';

// Types
interface PricingContextType {
  selectedCurrency: string;
  selectedCountry: string;
  setCurrency: (currency: string) => void;
  currencies: CurrencyOption[];
  prices: PriceData | null;
  loading: boolean;
  error: string | null;
  refetchPrices: () => void;
}

// Create context
const PricingContext = createContext<PricingContextType | undefined>(undefined);

// Provider component
interface PricingProviderProps {
  children: ReactNode;
}

export const PricingProvider: React.FC<PricingProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = React.useState('USD');
  const [selectedCountry, setSelectedCountry] = React.useState('US');

  // Use the custom hook for pricing data with React Query
  const {
    currencies = [] as CurrencyOption[],
    prices = null as PriceData | null,
    loading,
    error,
    refetchPrices,
  } = usePricingData(selectedCountry);

  // Set default currency when currencies are loaded
  React.useEffect(() => {
    if (currencies.length > 0 && selectedCurrency === 'USD') {
      const defaultCurrency = currencies.find(c => c.currency === 'USD') || currencies[0];
      if (defaultCurrency) {
        setSelectedCurrency(defaultCurrency.currency);
        setSelectedCountry(defaultCurrency.value);
      }
    }
  }, [currencies, selectedCurrency]);

  // Context methods
  const setCurrency = (currency: string) => {
    const currencyOption = currencies.find(c => c.currency === currency);
    if (currencyOption) {
      setSelectedCurrency(currencyOption.currency);
      setSelectedCountry(currencyOption.value);
    }
  };

  const contextValue: PricingContextType = {
    selectedCurrency,
    selectedCountry,
    setCurrency,
    currencies,
    prices,
    loading,
    error: error?.message || null,
    refetchPrices,
  };

  return (
    <PricingContext.Provider value={contextValue}>
      {children}
    </PricingContext.Provider>
  );
};

// Custom hook to use the context
export const usePricing = (): PricingContextType => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};

// Additional utility hooks
export const useCurrency = () => {
  const { selectedCurrency, currencies, setCurrency } = usePricing();
  return { selectedCurrency, currencies, setCurrency };
};

export const usePrices = () => {
  const { prices, loading, error, refetchPrices } = usePricing();
  return { prices, loading, error, refreshPrices: refetchPrices };
};

export const useTicketPrice = (ticketType: 'premium' | 'standard') => {
  const { prices, selectedCurrency } = usePricing();
  
  if (!prices) return null;
  
  return {
    amount: ticketType === 'premium' ? prices.premium : prices.standard,
    currency: selectedCurrency,
  };
};