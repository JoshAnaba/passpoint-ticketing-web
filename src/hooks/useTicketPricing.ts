import { useState, useEffect } from 'react';
import { getAvailableCurrencies, getPricesForCountry, getCurrenciesWithPrices, CurrencyOption, PriceData } from '@/services/api';

export interface TicketPricingState {
  currencies: CurrencyOption[];
  selectedCurrency: string;
  selectedCountry: string;
  prices: PriceData | null;
  loading: boolean;
  error: string | null;
}

export const useTicketPricing = () => {
  const [state, setState] = useState<TicketPricingState>({
    currencies: [],
    selectedCurrency: 'USD',
    selectedCountry: 'US',
    prices: null,
    loading: true,
    error: null,
  });

  // Load currencies on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const currencies = await getAvailableCurrencies();
        
        // Set default currency to first available or USD
        const defaultCurrency = currencies.find(c => c.currency === 'USD') || currencies[0];
        
        setState(prev => ({
          ...prev,
          currencies,
          selectedCurrency: defaultCurrency?.currency || 'USD',
          selectedCountry: defaultCurrency?.value || 'US',
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load currencies',
        }));
      }
    };

    loadCurrencies();
  }, []);

  // Load prices when currency changes
  useEffect(() => {
    const loadPrices = async () => {
      if (!state.selectedCountry) return;
      
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const prices = await getPricesForCountry(state.selectedCountry);
        
        setState(prev => ({
          ...prev,
          prices,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load prices',
        }));
      }
    };

    loadPrices();
  }, [state.selectedCountry]);

  const setCurrency = (currency: string) => {
    const currencyOption = state.currencies.find(c => c.currency === currency);
    if (currencyOption) {
      setState(prev => ({
        ...prev,
        selectedCurrency: currency,
        selectedCountry: currencyOption.value,
      }));
    }
  };

  const refreshPrices = async () => {
    if (!state.selectedCountry) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const prices = await getPricesForCountry(state.selectedCountry);
      
      setState(prev => ({
        ...prev,
        prices,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to refresh prices',
      }));
    }
  };

  return {
    ...state,
    setCurrency,
    refreshPrices,
  };
};