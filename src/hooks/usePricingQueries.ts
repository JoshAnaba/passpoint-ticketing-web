import { useQuery } from '@tanstack/react-query';
import { getAvailableCurrencies, getPricesForCountry, CurrencyOption, PriceData } from '@/services/api';

// Custom hook for currencies query
export const useCurrenciesQuery = () => {
  return useQuery<CurrencyOption[]>({
    queryKey: ['currencies'],
    queryFn: getAvailableCurrencies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

// Custom hook for prices query
export const usePricesQuery = (countryCode: string) => {
  return useQuery<PriceData | null>({
    queryKey: ['prices', countryCode],
    queryFn: () => getPricesForCountry(countryCode),
    enabled: !!countryCode,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

// Combined hook for both currencies and prices
export const usePricingData = (selectedCountry: string) => {
  const currenciesQuery = useCurrenciesQuery();
  const pricesQuery = usePricesQuery(selectedCountry);

  return {
    currencies: currenciesQuery.data || [],
    prices: pricesQuery.data || null,
    loading: currenciesQuery.isLoading || pricesQuery.isLoading,
    error: currenciesQuery.error || pricesQuery.error,
    refetchCurrencies: currenciesQuery.refetch,
    refetchPrices: pricesQuery.refetch,
    isCurrenciesLoading: currenciesQuery.isLoading,
    isPricesLoading: pricesQuery.isLoading,
  };
};