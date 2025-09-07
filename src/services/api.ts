// API service for Passpoint ticket pricing and currency data

import { API_CONFIG } from '@/config/api';

// Types for API responses
export interface CurrencyOption {
  name: string;
  value: string;
  currency: string;
}

export interface PriceData {
  currency: string;
  premium: number;
  standard: number;
}

export interface PriceResponse {
  responseCode: string;
  responseDescription: string;
  responseMessage: string;
  otherInfo: string;
  data: Record<string, PriceData>;
}

// Generic API request function
async function apiRequest<T>(endpoint: string): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Get available currencies
export const getAvailableCurrencies = async (): Promise<CurrencyOption[]> => {
  try {
    const response = await apiRequest<CurrencyOption[]>(API_CONFIG.ENDPOINTS.CURRENCIES);
    return response;
  } catch (error) {
    console.error('Failed to fetch currencies:', error);
    // Fallback to default currencies
    return API_CONFIG.FALLBACK_CURRENCIES;
  }
};

// Get prices for a specific country/currency
export const getPricesForCountry = async (countryCode: string): Promise<PriceData | null> => {
  try {
    const response = await apiRequest<PriceResponse>(API_CONFIG.ENDPOINTS.PRICES(countryCode));
    
    if (response.responseCode === '00' && response.data[countryCode]) {
      return response.data[countryCode];
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error(`Failed to fetch prices for ${countryCode}:`, error);
    return null;
  }
};

// Get prices for multiple countries
export const getPricesForMultipleCountries = async (countryCodes: string[]): Promise<Record<string, PriceData>> => {
  const prices: Record<string, PriceData> = {};
  
  try {
    // Fetch prices for all countries in parallel
    const promises = countryCodes.map(async (countryCode) => {
      const priceData = await getPricesForCountry(countryCode);
      if (priceData) {
        prices[countryCode] = priceData;
      }
    });
    
    await Promise.all(promises);
    return prices;
  } catch (error) {
    console.error('Failed to fetch prices for multiple countries:', error);
    return prices;
  }
};

// Get all available currencies with their prices
export const getCurrenciesWithPrices = async (): Promise<Array<CurrencyOption & { prices?: PriceData }>> => {
  try {
    const currencies = await getAvailableCurrencies();
    const countryCodes = currencies.map(c => c.value);
    const prices = await getPricesForMultipleCountries(countryCodes);
    
    return currencies.map(currency => ({
      ...currency,
      prices: prices[currency.value] || undefined
    }));
  } catch (error) {
    console.error('Failed to fetch currencies with prices:', error);
    return [];
  }
};

// Utility function to get price for a specific ticket type
export const getTicketPrice = (priceData: PriceData, ticketType: 'premium' | 'standard'): number => {
  return ticketType === 'premium' ? priceData.premium : priceData.standard;
};

// Utility function to format price data for our components
export const formatPriceDataForComponent = (priceData: PriceData, ticketType: 'premium' | 'standard') => {
  return {
    amount: getTicketPrice(priceData, ticketType),
    currency: priceData.currency,
    originalAmount: undefined, // No original price from API
    originalCurrency: undefined
  };
};