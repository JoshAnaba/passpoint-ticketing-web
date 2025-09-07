import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

interface CartState {
  tickets: TicketType[];
  totalItems: number;
  totalPrice: number;
  totalOriginalPrice: number;
}

interface CartContextType extends CartState {
  addTicket: (ticket: TicketType) => void;
  removeTicket: (ticketId: string) => void;
  updateTicketQuantity: (ticketId: string, quantity: number) => void;
  clearCart: () => void;
  getTicketById: (ticketId: string) => TicketType | undefined;
  hasTickets: boolean;
}

// Action types
type CartAction =
  | { type: 'ADD_TICKET'; payload: TicketType }
  | { type: 'REMOVE_TICKET'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { ticketId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_TICKETS'; payload: TicketType[] };

// Initial state
const initialState: CartState = {
  tickets: [],
  totalItems: 0,
  totalPrice: 0,
  totalOriginalPrice: 0,
};

// Helper functions
const calculateTotals = (tickets: TicketType[]) => {
  const totalItems = tickets.reduce((total, ticket) => total + ticket.quantity, 0);
  const totalPrice = tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  const totalOriginalPrice = tickets.reduce((total, ticket) => 
    total + ((ticket.originalPrice || ticket.price) * ticket.quantity), 0
  );
  
  return { totalItems, totalPrice, totalOriginalPrice };
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  let newTickets: TicketType[];
  
  switch (action.type) {
    case 'ADD_TICKET': {
      const existingTicketIndex = state.tickets.findIndex(t => t.id === action.payload.id);
      
      if (existingTicketIndex >= 0) {
        // Update existing ticket quantity
        newTickets = state.tickets.map((ticket, index) =>
          index === existingTicketIndex
            ? { ...ticket, quantity: ticket.quantity + action.payload.quantity }
            : ticket
        );
      } else {
        // Add new ticket
        newTickets = [...state.tickets, action.payload];
      }
      break;
    }
    
    case 'REMOVE_TICKET':
      newTickets = state.tickets.filter(ticket => ticket.id !== action.payload);
      break;
    
    case 'UPDATE_QUANTITY':
      newTickets = state.tickets.map(ticket =>
        ticket.id === action.payload.ticketId
          ? { ...ticket, quantity: Math.max(0, action.payload.quantity) }
          : ticket
      ).filter(ticket => ticket.quantity > 0); // Remove tickets with 0 quantity
      break;
    
    case 'CLEAR_CART':
      newTickets = [];
      break;
    
    case 'SET_TICKETS':
      newTickets = action.payload;
      break;
    
    default:
      return state;
  }
  
  const { totalItems, totalPrice, totalOriginalPrice } = calculateTotals(newTickets);
  
  return {
    tickets: newTickets,
    totalItems,
    totalPrice,
    totalOriginalPrice,
  };
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Context methods
  const addTicket = (ticket: TicketType) => {
    dispatch({ type: 'ADD_TICKET', payload: ticket });
  };

  const removeTicket = (ticketId: string) => {
    dispatch({ type: 'REMOVE_TICKET', payload: ticketId });
  };

  const updateTicketQuantity = (ticketId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { ticketId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTicketById = (ticketId: string) => {
    return state.tickets.find(ticket => ticket.id === ticketId);
  };

  const hasTickets = state.totalItems > 0;

  const contextValue: CartContextType = {
    ...state,
    addTicket,
    removeTicket,
    updateTicketQuantity,
    clearCart,
    getTicketById,
    hasTickets,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Additional utility hooks
export const useCartItems = () => {
  const { tickets, totalItems, hasTickets } = useCart();
  return { tickets, totalItems, hasTickets };
};

export const useCartTotals = () => {
  const { totalPrice, totalOriginalPrice, totalItems } = useCart();
  return { totalPrice, totalOriginalPrice, totalItems };
};

export const useCartActions = () => {
  const { addTicket, removeTicket, updateTicketQuantity, clearCart } = useCart();
  return { addTicket, removeTicket, updateTicketQuantity, clearCart };
};