// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://dev.mypasspoint.com',
  
  ENDPOINTS: {
    CURRENCIES: '/checkout/app/country-list',
    PRICES: (countryCode: string) => `/checkout/app/get-price-option/${countryCode}/abf`,
    GET_MERCHANT_API_KEY: (merchantId: string) => `/userapp/merchant-app/get-credential`,
  },
  
  // Default fallback data
  FALLBACK_CURRENCIES: [
    { name: "Nigeria", value: "NG", currency: "NGN" },
  ],
  
  FALLBACK_PRICES: {
    NGN: { currency: "NGN", premium: 0, standard: 0 },
  },
};