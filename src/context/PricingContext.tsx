import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { getAvailableCurrencies, getPricesForCountry, CurrencyOption, PriceData } from '@/services/api';

// Types
interface PricingState {
  currencies: CurrencyOption[];
  selectedCurrency: string;
  selectedCountry: string;
  prices: PriceData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface PricingContextType extends PricingState {
  setCurrency: (currency: string) => void;
  refreshPrices: () => Promise<void>;
  clearError: () => void;
}

// Action types
type PricingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENCIES'; payload: CurrencyOption[] }
  | { type: 'SET_CURRENCY'; payload: { currency: string; country: string } }
  | { type: 'SET_PRICES'; payload: PriceData }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LAST_UPDATED'; payload: number };

// Initial state
const initialState: PricingState = {
  currencies: [],
  selectedCurrency: 'USD',
  selectedCountry: 'US',
  prices: null,
  loading: true,
  error: null,
  lastUpdated: null,
};

// Reducer
function pricingReducer(state: PricingState, action: PricingAction): PricingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_CURRENCIES':
      return { ...state, currencies: action.payload };
    
    case 'SET_CURRENCY':
      return { 
        ...state, 
        selectedCurrency: action.payload.currency,
        selectedCountry: action.payload.country,
        error: null
      };
    
    case 'SET_PRICES':
      return { 
        ...state, 
        prices: action.payload, 
        loading: false, 
        error: null,
        lastUpdated: Date.now()
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    
    default:
      return state;
  }
}

// Create context
const PricingContext = createContext<PricingContextType | undefined>(undefined);

// Provider component
interface PricingProviderProps {
  children: ReactNode;
}

export const PricingProvider: React.FC<PricingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(pricingReducer, initialState);

  // Load currencies on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const currencies = await getAvailableCurrencies();
        dispatch({ type: 'SET_CURRENCIES', payload: currencies });
        
        // Set default currency to first available or USD
        const defaultCurrency = currencies.find(c => c.currency === 'USD') || currencies[0];
        if (defaultCurrency) {
          dispatch({ 
            type: 'SET_CURRENCY', 
            payload: { 
              currency: defaultCurrency.currency, 
              country: defaultCurrency.value 
            } 
          });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load currencies' });
      }
    };

    loadCurrencies();
  }, []);

  // Load prices when currency changes
  useEffect(() => {
    const loadPrices = async () => {
      if (!state.selectedCountry) return;
      
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const prices = await getPricesForCountry(state.selectedCountry);
        
        if (prices) {
          dispatch({ type: 'SET_PRICES', payload: prices });
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'No pricing data available' });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load prices' });
      }
    };

    loadPrices();
  }, [state.selectedCountry]);

  // Context methods
  const setCurrency = (currency: string) => {
    const currencyOption = state.currencies.find(c => c.currency === currency);
    if (currencyOption) {
      dispatch({ 
        type: 'SET_CURRENCY', 
        payload: { 
          currency: currencyOption.currency, 
          country: currencyOption.value 
        } 
      });
    }
  };

  const refreshPrices = async () => {
    if (!state.selectedCountry) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const prices = await getPricesForCountry(state.selectedCountry);
      
      if (prices) {
        dispatch({ type: 'SET_PRICES', payload: prices });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'No pricing data available' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh prices' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: PricingContextType = {
    ...state,
    setCurrency,
    refreshPrices,
    clearError,
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
  const { prices, loading, error, refreshPrices } = usePricing();
  return { prices, loading, error, refreshPrices };
};

export const useTicketPrice = (ticketType: 'premium' | 'standard') => {
  const { prices, selectedCurrency } = usePricing();
  
  if (!prices) return null;
  
  return {
    amount: ticketType === 'premium' ? prices.premium : prices.standard,
    currency: selectedCurrency,
  };
};