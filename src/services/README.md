# API Integration Documentation

## Overview

This directory contains the API integration for the Passpoint ticket system, including currency options and pricing data.

## Files

### `api.ts`
Main API service with functions to fetch currencies and prices from the Passpoint API.

### `../hooks/useTicketPricing.ts`
React hook that manages ticket pricing state and API calls.

### `../config/api.ts`
Configuration file with API endpoints and fallback data.

## API Endpoints

### Base URL
- **Production**: `https://dev.mypasspoint.com`
- **Configurable**: Set `VITE_API_BASE_URL` environment variable

### Endpoints

1. **Get Available Currencies**
   ```
   GET /checkout/app/get-currency-options
   ```
   Returns array of currency options with name, value, and currency code.

2. **Get Prices for Country**
   ```
   GET /checkout/app/get-price-option/{countryCode}/abf
   ```
   Returns pricing data for a specific country.

## Usage Examples

### Using the Hook
```typescript
import { useTicketPricing } from '@/hooks/useTicketPricing';

const MyComponent = () => {
  const { currencies, prices, loading, setCurrency } = useTicketPricing();
  
  return (
    <div>
      {loading ? 'Loading...' : (
        <select onChange={(e) => setCurrency(e.target.value)}>
          {currencies.map(currency => (
            <option key={currency.currency} value={currency.currency}>
              {currency.name} ({currency.currency})
            </option>
          ))}
        </select>
      )}
      
      {prices && (
        <div>
          Premium: {prices.premium} {prices.currency}
          Standard: {prices.standard} {prices.currency}
        </div>
      )}
    </div>
  );
};
```

### Direct API Calls
```typescript
import { getAvailableCurrencies, getPricesForCountry } from '@/services/api';

// Get all currencies
const currencies = await getAvailableCurrencies();

// Get prices for Nigeria
const prices = await getPricesForCountry('NG');
```

## Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=https://dev.mypasspoint.com
```

## Error Handling

The API service includes comprehensive error handling:

- **Network errors**: Graceful fallback to default data
- **Invalid responses**: Logged and handled appropriately
- **Loading states**: Managed by the React hook
- **Fallback data**: Provided for offline/error scenarios

## Data Flow

1. **Component mounts** → Hook initializes
2. **Fetch currencies** → Update state with available options
3. **User selects currency** → Fetch prices for selected country
4. **Prices loaded** → Update ticket pricing throughout app
5. **Currency change** → Repeat price fetching process

## Integration Points

The API data is integrated into:

- **EventInfo component**: Currency selector and price display
- **TicketSelectionModal**: Dynamic ticket pricing
- **CartModal**: Price calculations
- **CheckoutModal**: Final pricing display

## Testing

To test the API integration:

1. **Check network tab** for API calls
2. **Verify currency dropdown** populates correctly
3. **Test currency switching** updates prices
4. **Check fallback behavior** when API is unavailable

## Future Enhancements

- Real-time price updates
- Caching for better performance
- Offline support with service workers
- Price history tracking
- Multi-event support