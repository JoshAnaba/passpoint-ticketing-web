# Currency System Documentation

## Overview

This currency system provides comprehensive support for multiple currencies with proper formatting, localization, and API integration capabilities.

## Features

- ✅ Support for 10+ currencies including African, European, and major global currencies
- ✅ Proper currency formatting with locale-specific number formatting
- ✅ Symbol positioning (before/after amount)
- ✅ API-ready price data structures
- ✅ Exchange rate support
- ✅ TypeScript type safety
- ✅ Fallback handling for unknown currencies

## Supported Currencies

| Code | Symbol | Name | Locale |
|------|--------|------|--------|
| NGN | ₦ | Nigerian Naira | en-NG |
| USD | $ | US Dollar | en-US |
| EUR | € | Euro | en-EU |
| GBP | £ | British Pound | en-GB |
| CAD | C$ | Canadian Dollar | en-CA |
| AUD | A$ | Australian Dollar | en-AU |
| JPY | ¥ | Japanese Yen | ja-JP |
| ZAR | R | South African Rand | en-ZA |
| KES | KSh | Kenyan Shilling | en-KE |
| GHS | GH₵ | Ghanaian Cedi | en-GH |

## Usage

### Basic Currency Formatting

```typescript
import { formatCurrency } from '@/lib/currency';

// Format with symbol
formatCurrency(1500, 'NGN'); // "₦1,500.00"
formatCurrency(1500, 'USD'); // "$1,500.00"
formatCurrency(1500, 'EUR'); // "€1,500.00"

// Format without symbol
formatCurrency(1500, 'NGN', { showSymbol: false }); // "1,500.00"

// Format without decimals
formatCurrency(1500, 'NGN', { showDecimals: false }); // "₦1,500"
```

### API Integration

```typescript
import { PriceData, formatPriceData } from '@/lib/currency';

// API price data structure
const priceData: PriceData = {
  amount: 1500,
  currency: 'NGN',
  originalAmount: 2000,
  originalCurrency: 'NGN'
};

// Format API price data
formatPriceData(priceData); // "₦1,500.00"
```

### Component Integration

```typescript
// In your component
import { formatCurrency, getCurrencySymbol } from '@/lib/currency';

const TicketPrice = ({ price, currency }) => (
  <div>
    <span>{formatCurrency(price, currency)}</span>
  </div>
);
```

## API Structure

### PriceData Interface

```typescript
interface PriceData {
  amount: number;
  currency: string;
  originalAmount?: number;
  originalCurrency?: string;
}
```

### API Ticket Structure

```typescript
interface ApiTicketType {
  id: string;
  name: string;
  description: string;
  prices: PriceData[]; // Multiple currencies
  originalPrices?: PriceData[];
  quantity: number;
  maxQuantity?: number;
  isAvailable: boolean;
  category: 'premium' | 'standard' | 'vip' | 'early-bird';
  features: string[];
}
```

## Adding New Currencies

To add a new currency, update the `CURRENCIES` object in `src/lib/currency.ts`:

```typescript
export const CURRENCIES: Record<string, Currency> = {
  // ... existing currencies
  NEW_CURRENCY: {
    code: 'NEW',
    symbol: 'N$',
    name: 'New Currency',
    locale: 'en-NEW',
    position: 'before'
  }
};
```

## Common Currency Lists

- `COMMON_CURRENCIES`: African and major global currencies for dropdowns
- `DEFAULT_CURRENCY`: Default currency (NGN)

## Error Handling

The system includes robust error handling:

- Unknown currencies fall back to showing the currency code
- Invalid locale formatting falls back to basic number formatting
- API errors are properly typed and handled

## Performance Considerations

- Currency formatting uses native `Intl.NumberFormat` for optimal performance
- Fallback formatting is lightweight for edge cases
- Currency data is statically defined to avoid runtime lookups

## Testing

```typescript
// Example test cases
describe('Currency Formatting', () => {
  it('should format NGN correctly', () => {
    expect(formatCurrency(1500, 'NGN')).toBe('₦1,500.00');
  });

  it('should handle unknown currency', () => {
    expect(formatCurrency(1500, 'UNKNOWN')).toBe('UNKNOWN 1,500.00');
  });
});
```

## Migration from Hardcoded Currency

If you're migrating from hardcoded currency logic:

1. Replace `{currency === "NGN" ? "₦" : "$"}` with `formatCurrency(amount, currency)`
2. Update currency dropdowns to use `getAvailableCurrencies()`
3. Replace currency symbols with `getCurrencySymbol(currency)`
4. Update API integration to use `PriceData` interface

## Future Enhancements

- Real-time exchange rate integration
- Currency conversion utilities
- Localized currency names
- Historical exchange rate data
- Currency validation