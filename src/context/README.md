# Context API Documentation

## Overview

This directory contains React Context providers for global state management in the Passpoint ticket application. The context API provides centralized state management for pricing, currency, and cart functionality.

## Files

### `PricingContext.tsx`
Manages global pricing and currency state including:
- Available currencies from API
- Selected currency and country
- Current pricing data
- Loading and error states

### `CartContext.tsx`
Manages global cart state including:
- Cart items (tickets)
- Total calculations
- Cart operations (add, remove, update)

### `AppProvider.tsx`
Combined provider that wraps all context providers for easy setup.

### `index.ts`
Central export file for all context-related functionality.

## Usage

### Setup

Wrap your app with the `AppProvider`:

```tsx
import { AppProvider } from '@/context';

function App() {
  return (
    <AppProvider>
      {/* Your app components */}
    </AppProvider>
  );
}
```

### Using Pricing Context

```tsx
import { useCurrency, usePrices, useTicketPrice } from '@/context';

function MyComponent() {
  // Get currency state and actions
  const { selectedCurrency, currencies, setCurrency } = useCurrency();
  
  // Get pricing data
  const { prices, loading, error, refreshPrices } = usePrices();
  
  // Get specific ticket price
  const premiumPrice = useTicketPrice('premium');
  
  return (
    <div>
      <select onChange={(e) => setCurrency(e.target.value)}>
        {currencies.map(currency => (
          <option key={currency.currency} value={currency.currency}>
            {currency.name}
          </option>
        ))}
      </select>
      
      {loading ? 'Loading...' : (
        <div>
          Premium: {premiumPrice?.amount} {premiumPrice?.currency}
        </div>
      )}
    </div>
  );
}
```

### Using Cart Context

```tsx
import { useCart, useCartItems, useCartTotals, useCartActions } from '@/context';

function MyComponent() {
  // Get full cart state
  const cart = useCart();
  
  // Get just cart items
  const { tickets, totalItems, hasTickets } = useCartItems();
  
  // Get just totals
  const { totalPrice, totalOriginalPrice } = useCartTotals();
  
  // Get just actions
  const { addTicket, removeTicket, updateTicketQuantity, clearCart } = useCartActions();
  
  return (
    <div>
      <p>Items in cart: {totalItems}</p>
      <p>Total: {totalPrice}</p>
      
      <button onClick={() => addTicket({
        id: 'premium',
        name: 'Premium',
        price: 500,
        quantity: 1
      })}>
        Add Premium Ticket
      </button>
    </div>
  );
}
```

## Available Hooks

### Pricing Hooks

- **`usePricing()`** - Full pricing context with all state and actions
- **`useCurrency()`** - Currency selection state and actions
- **`usePrices()`** - Pricing data and loading states
- **`useTicketPrice(ticketType)`** - Get price for specific ticket type

### Cart Hooks

- **`useCart()`** - Full cart context with all state and actions
- **`useCartItems()`** - Cart items and counts
- **`useCartTotals()`** - Price calculations
- **`useCartActions()`** - Cart manipulation functions

## State Structure

### Pricing State
```typescript
{
  currencies: CurrencyOption[];      // Available currencies
  selectedCurrency: string;          // Current currency (e.g., 'USD')
  selectedCountry: string;           // Current country (e.g., 'US')
  prices: PriceData | null;          // Current pricing data
  loading: boolean;                  // Loading state
  error: string | null;              // Error message
  lastUpdated: number | null;        // Last update timestamp
}
```

### Cart State
```typescript
{
  tickets: TicketType[];             // Cart items
  totalItems: number;                // Total quantity
  totalPrice: number;                // Total price
  totalOriginalPrice: number;        // Total original price
}
```

## Benefits

1. **Centralized State**: All pricing and cart data in one place
2. **Automatic Updates**: Components automatically re-render when state changes
3. **Type Safety**: Full TypeScript support with proper typing
4. **Performance**: Optimized with React's built-in context optimization
5. **Separation of Concerns**: Clear separation between pricing and cart logic
6. **Easy Testing**: Context can be easily mocked for testing

## Migration from Local State

### Before (Local State)
```tsx
const [currency, setCurrency] = useState('USD');
const [cartTickets, setCartTickets] = useState([]);

// Pass props down through multiple levels
<Component currency={currency} cartTickets={cartTickets} />
```

### After (Context)
```tsx
// No local state needed
const { selectedCurrency } = useCurrency();
const { tickets } = useCart();

// Direct access in any component
<Component />
```

## Best Practices

1. **Use Specific Hooks**: Use `useCurrency()` instead of `usePricing()` when you only need currency data
2. **Error Handling**: Always check for loading and error states
3. **Performance**: Use specific hooks to avoid unnecessary re-renders
4. **Type Safety**: Import types from context for consistency

## Integration with Components

The context is already integrated with:
- **EventInfo**: Currency selection and price display
- **TicketSelectionModal**: Dynamic pricing
- **CartModal**: Cart state management
- **CheckoutModal**: Final pricing
- **Header**: Cart item count

All components automatically receive updates when context state changes.