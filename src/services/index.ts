// API service functions for ticket and event data

import { EventApiResponse, TicketPurchaseRequest, TicketPurchaseResponse } from '@/types/api';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.passpoint.com';

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Add authentication headers here when needed
    // 'Authorization': `Bearer ${getAuthToken()}`,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Event and ticket services
export const eventService = {
  // Get event details with tickets
  async getEventDetails(eventId: string): Promise<EventApiResponse> {
    return apiRequest<EventApiResponse>(`/events/${eventId}`);
  },

  // Get available currencies for an event
  async getAvailableCurrencies(eventId: string): Promise<string[]> {
    return apiRequest<string[]>(`/events/${eventId}/currencies`);
  },

  // Get real-time pricing for tickets
  async getTicketPricing(eventId: string, currency: string): Promise<Record<string, number>> {
    return apiRequest<Record<string, number>>(`/events/${eventId}/pricing?currency=${currency}`);
  },
};

export const ticketService = {
  // Purchase tickets
  async purchaseTickets(purchaseData: TicketPurchaseRequest): Promise<TicketPurchaseResponse> {
    return apiRequest<TicketPurchaseResponse>('/tickets/purchase', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
  },

  // Validate ticket availability
  async validateTickets(eventId: string, ticketRequests: { ticketId: string; quantity: number }[]): Promise<boolean> {
    return apiRequest<boolean>('/tickets/validate', {
      method: 'POST',
      body: JSON.stringify({ eventId, tickets: ticketRequests }),
    });
  },
};

export const currencyService = {
  // Get exchange rates
  async getExchangeRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    return apiRequest<Record<string, number>>(`/currency/rates?base=${baseCurrency}`);
  },

  // Convert amount between currencies
  async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    const rates = await this.getExchangeRates(from);
    return amount * (rates[to] || 1);
  },
};

// Example usage in components:
/*
// In your component:
import { eventService } from '@/services';

const fetchEventData = async () => {
  try {
    const eventData = await eventService.getEventDetails('event-123');
    setEvent(eventData.event);
    setTickets(eventData.tickets);
  } catch (error) {
    console.error('Failed to fetch event data:', error);
  }
};
*/