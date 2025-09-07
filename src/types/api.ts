// API response types for ticket pricing and event data

import { PriceData } from '@/lib/currency';

// Base ticket type that will come from API
export interface ApiTicketType {
  id: string;
  name: string;
  description: string;
  prices: PriceData[]; // Array of prices in different currencies
  originalPrices?: PriceData[]; // Optional original prices for discounts
  quantity: number;
  maxQuantity?: number;
  isAvailable: boolean;
  category: 'premium' | 'standard' | 'vip' | 'early-bird';
  features: string[];
}

// Event information from API
export interface ApiEventInfo {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bannerImage: string;
  logoImage?: string;
  organizer: {
    name: string;
    logo?: string;
    website?: string;
  };
  tags: string[];
  status: 'upcoming' | 'live' | 'ended' | 'cancelled';
}

// API response for event details
export interface EventApiResponse {
  event: ApiEventInfo;
  tickets: ApiTicketType[];
  currencyRates?: Record<string, number>; // Exchange rates if needed
}

// API request for ticket purchase
export interface TicketPurchaseRequest {
  eventId: string;
  tickets: {
    ticketId: string;
    quantity: number;
  }[];
  contactInfo: {
    fullName: string;
    email: string;
    phone?: string;
  };
  currency: string;
  paymentMethod?: string;
}

// API response for ticket purchase
export interface TicketPurchaseResponse {
  success: boolean;
  orderId: string;
  paymentUrl?: string;
  tickets: {
    ticketId: string;
    quantity: number;
    qrCode?: string;
    ticketNumber: string;
  }[];
  totalAmount: PriceData;
  expiresAt?: string;
}

// Utility function to get price for specific currency from API data
export const getPriceForCurrency = (
  prices: PriceData[], 
  currency: string
): PriceData | null => {
  return prices.find(price => price.currency === currency) || null;
};

// Utility function to convert local ticket type to API format
export const convertToApiTicket = (ticket: ApiTicketType, currency: string) => {
  const price = getPriceForCurrency(ticket.prices, currency);
  const originalPrice = ticket.originalPrices 
    ? getPriceForCurrency(ticket.originalPrices, currency)
    : null;

  return {
    id: ticket.id,
    name: ticket.name,
    description: ticket.description,
    price: price?.amount || 0,
    originalPrice: originalPrice?.amount,
    quantity: ticket.quantity,
    maxQuantity: ticket.maxQuantity,
    isAvailable: ticket.isAvailable,
    category: ticket.category,
    features: ticket.features
  };
};