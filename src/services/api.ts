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
  merchantId?: string;
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

// Generic API POST function
async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API POST error:', error);
    throw error;
  }
}

// -------------------- Shared header helpers (Vite env) --------------------

// Build request config similar to the Next.js example (Vite uses import.meta.env)
export const getRequestConfig = () => {
  const channelId = import.meta.env.VITE_PAYMENT_CHANNEL_ID as string | undefined;
  const channelCode = import.meta.env.VITE_PAYMENT_CHANNEL_CODE as string | undefined;
  // const merchant = getMerchantId();
  const merchant = getMerchantId();
  console.log('merchant', merchant);

  return {
    headers: {
      'x-channel-id': channelId || '2',
      'x-channel-code': channelCode,
      'x-merchant-id': merchant || '',
    } as Record<string, string>,
    params: {} as Record<string, string>,
  };
};

export const setBasicAuthConfig = () => {
  const username = import.meta.env.VITE_PAYMENT_USERNAME as string | undefined;
  const password = import.meta.env.VITE_PAYMENT_PASSWORD as string | undefined;
  const config = getRequestConfig();
  if (username && password) {
    const encode = btoa(`${username}:${password}`);
    (config.headers as Record<string, string>).Authorization = `Basic ${encode}`;
  }
  return config;
};

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
    const {data} = response;
    if (response.responseCode === '00' && data[countryCode]) {
      // const merchantId = response.merchantId;
      const {merchantId, clientId} = response.data as any;
      // console.log('merchantId', merchantId)
      // console.log('clientId', clientId)
      if (merchantId) sessionStorage.setItem('merchantId', merchantId);
      if (clientId) sessionStorage.setItem('clientId', clientId);
      // if (merchantId) {
        // sessionStorage.setItem('merchantId', merchantId);
        // getMerchantApiKey(merchantId);
      // }
      // initMerchantCredentials(response.otherInfo);
      return response.data[countryCode];
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error(`Failed to fetch prices for ${countryCode}:`, error);
    return null;
  }
};

export const getMerchantId = (): string | null => {
  return sessionStorage.getItem('merchantId') || null;
  // return 'fbf215c2-d6cd-4d88-be4e-e9b6d55dc78d'
}
export const getClientId = (): string | null => {
  return sessionStorage.getItem('clientId') || null;
  // return 'fbf215c2-d6cd-4d88-be4e-e9b6d55dc78d'
}

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

// -------------------- Checkout: initiate payment --------------------

export interface InitiatePaymentRequest {
  countryCode: string;
  amount: number;
  narration: string;
  successUrl: string;
  failureUrl: string;
  email: string;
  fullName: string;
}

export interface InitiatePaymentResponse {
  responseCode?: string;
  responseMessage?: string;
  responseDescription?: string;
  data?: unknown;
  redirectUrl?: string;
  paymentUrl?: string;
}

const INITIATE_PAYMENT_ENDPOINT = '/checkout/api/initiate-payment';

export const initiatePayment = async (
  payload: InitiatePaymentRequest,
  auth?: { accessToken: string; merchantId: string; tokenType?: string }
): Promise<InitiatePaymentResponse> => {
  const channelCode = import.meta.env.VITE_PAYMENT_CHANNEL_CODE as string | undefined;
  const url = `${API_CONFIG.BASE_URL}${INITIATE_PAYMENT_ENDPOINT}`;
  const cfg = getRequestConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...cfg.headers,
    'x-channel-code': channelCode
  };
  if (auth?.accessToken) headers['Authorization'] = `Bearer ${auth.accessToken}`;
  if (auth?.merchantId) headers['x-merchant-id'] = auth.merchantId;
  if (!headers['x-merchant-id']) headers['x-merchant-id'] = getMerchantId();

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('initiatePayment error:', error);
    throw error;
  }
};

// -------------------- Merchant credentials (token) --------------------

export interface InitCredentialsRequest {
  merchantId: string;
}

export interface InitCredentialsResponse {
  responseCode?: string;
  responseDescription?: string;
  responseMessage?: string;
  data?: {
    expiresIn?: number;
    accessToken?: string;
    apiKey?: string;
    tokenType?: string; // e.g. 'Bearer'
  };
}

const INIT_CREDENTIALS_URL = '/userapp/merchant-app/init-credentials';

export const initMerchantCredentials = async (
  merchantId: string
): Promise<InitCredentialsResponse> => {
  const cfg = setBasicAuthConfig();
  const headers = {
    'Content-Type': 'application/json',
    ...cfg.headers,
  } as Record<string, string>;
  const url = `${API_CONFIG.BASE_URL}${INIT_CREDENTIALS_URL}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ merchantId } as InitCredentialsRequest),
    });
    if (!res.ok) throw new Error(`Init credentials failed: ${res.status} ${res.statusText}`);
    const json = await res.json();
    try {
      const apiKey = (json as InitCredentialsResponse)?.data?.apiKey as string | undefined;
      if (apiKey) sessionStorage.setItem('merchantApiKey', apiKey);
    } catch (_) {
      // ignore storage errors (e.g., SSR)
    }
    return json;
  } catch (error) {
    console.error('initMerchantCredentials error:', error);
    throw error;
  }
};

const MERCHANT_API_KEY_URL = '/userapp/merchant-app/get-credential'
export const getMerchantApiKey = async (
  merchantId: string
): Promise<InitCredentialsResponse> => {
  const cfg = setBasicAuthConfig();
  const headers = {
    'Content-Type': 'application/json',
    ...cfg.headers,
    'x-merchant-id': merchantId,
  } as Record<string, string>;
  const url = `${API_CONFIG.BASE_URL}${MERCHANT_API_KEY_URL}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      // body: JSON.stringify({ merchantId } as InitCredentialsRequest),
    });
    if (!res.ok) throw new Error(`get credentials failed: ${res.status} ${res.statusText}`);
    const json = await res.json();
    try {
      const apiKey = (json as InitCredentialsResponse)?.data?.apiKey as string | undefined;
      if (apiKey) sessionStorage.setItem('merchantApiKey', apiKey);
    } catch (_) {
      // ignore storage errors (e.g., SSR)
    }
    return json;
  } catch (error) {
    console.error('initMerchantCredentials error:', error);
    throw error;
  }
};

// -------------------- OAuth: generate token from apiKey --------------------

export interface GenerateTokenRequest {
  merchantId: string;
  apiKey: string;
}

export interface GenerateTokenResponse {
  responseCode?: string;
  responseDescription?: string;
  responseMessage?: string;
  data?: {
    accessToken?: string;
    tokenType?: string; // Bearer
    expiresIn?: number;
  };
}

const GENERATE_TOKEN_URL = '/appsecure/oauth/generate-token';

export const generateToken = async (
  merchantId: string,
  apiKey: string
): Promise<GenerateTokenResponse> => {
  const url = `${API_CONFIG.BASE_URL}${GENERATE_TOKEN_URL}`;
  const headers: Record<string, string> = {
    // apptype: 'appservices',
    apptype: 'checkout',
    "Content-Type": "application/json",
  };
  const body: GenerateTokenRequest = { merchantId, apiKey };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`generate token failed: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('generateToken error:', error);
    throw error;
  }
};