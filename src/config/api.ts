// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://dev.mypasspoint.com',
  
  ENDPOINTS: {
    CURRENCIES: '/checkout/app/country-list',
    PRICES: (countryCode: string) => `/checkout/app/get-price-option/${countryCode}/abf`,
  },
  
  // Default fallback data
  FALLBACK_CURRENCIES: [
    { name: "Nigeria", value: "NG", currency: "NGN" },
    { name: "United States", value: "US", currency: "USD" },
    { name: "United Kingdom", value: "GB", currency: "GBP" },
    { name: "European Union", value: "EU", currency: "EUR" },
  ],
  
  FALLBACK_PRICES: {
    NGN: { currency: "NGN", premium: 431000, standard: 215000 },
    USD: { currency: "USD", premium: 500, standard: 250 },
    GBP: { currency: "GBP", premium: 400, standard: 200 },
    EUR: { currency: "EUR", premium: 450, standard: 225 },
  },
};