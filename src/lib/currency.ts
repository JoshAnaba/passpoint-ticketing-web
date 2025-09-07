// Currency configuration and utility functions
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  position: 'before' | 'after';
}

export const CURRENCIES: Record<string, Currency> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    locale: 'en-NG',
    position: 'before'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    position: 'before'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'en-EU',
    position: 'before'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    position: 'before'
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
    position: 'before'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    locale: 'en-AU',
    position: 'before'
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
    position: 'before'
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    locale: 'en-ZA',
    position: 'before'
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    locale: 'en-KE',
    position: 'before'
  },
  GHS: {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    locale: 'en-GH',
    position: 'before'
  }
};

// Price structure for API-served prices
export interface PriceData {
  amount: number;
  currency: string;
  originalAmount?: number;
  originalCurrency?: string;
}

// Utility function to format currency
export const formatCurrency = (
  amount: number, 
  currencyCode: string, 
  options: {
    showSymbol?: boolean;
    showDecimals?: boolean;
    locale?: string;
  } = {}
): string => {
  const {
    showSymbol = true,
    showDecimals = true,
    locale
  } = options;

  const currency = CURRENCIES[currencyCode];
  if (!currency) {
    // Fallback for unknown currencies
    return `${currencyCode} ${amount.toLocaleString()}`;
  }

  const formatLocale = locale || currency.locale;
  
  try {
    const formattedAmount = new Intl.NumberFormat(formatLocale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(amount);

    // If we don't want to show symbol, remove it
    if (!showSymbol) {
      return formattedAmount.replace(/[^\d.,\s]/g, '').trim();
    }

    return formattedAmount;
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    const formattedNumber = amount.toLocaleString(formatLocale, {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    });

    if (showSymbol) {
      return currency.position === 'before' 
        ? `${currency.symbol}${formattedNumber}`
        : `${formattedNumber} ${currency.symbol}`;
    }

    return formattedNumber;
  }
};

// Utility function to get currency symbol only
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES[currencyCode];
  return currency ? currency.symbol : currencyCode;
};

// Utility function to get currency name
export const getCurrencyName = (currencyCode: string): string => {
  const currency = CURRENCIES[currencyCode];
  return currency ? currency.name : currencyCode;
};

// Utility function to get all available currencies
export const getAvailableCurrencies = (): Currency[] => {
  return Object.values(CURRENCIES);
};

// Utility function to convert price data to formatted string
export const formatPriceData = (
  priceData: PriceData,
  options: {
    showSymbol?: boolean;
    showDecimals?: boolean;
    locale?: string;
  } = {}
): string => {
  return formatCurrency(priceData.amount, priceData.currency, options);
};

// Utility function to format price with original price (for discounts)
export const formatPriceWithOriginal = (
  currentPrice: number,
  currencyCode: string,
  originalPrice?: number,
  originalCurrency?: string,
  options: {
    showSymbol?: boolean;
    showDecimals?: boolean;
    locale?: string;
  } = {}
): { current: string; original?: string } => {
  const current = formatCurrency(currentPrice, currencyCode, options);
  
  let original: string | undefined;
  if (originalPrice && originalCurrency) {
    original = formatCurrency(originalPrice, originalCurrency, options);
  }

  return { current, original };
};

// Default currency
export const DEFAULT_CURRENCY = 'USD';

// Common currency pairs for the African market
export const COMMON_CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP', 'ZAR', 'KES', 'GHS'];