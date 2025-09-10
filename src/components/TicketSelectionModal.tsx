import { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { useCurrency, usePrices, useCart, TicketType } from "@/context";
import PrimaryButton from "./PrimaryButton";

const SheetHeaderComp = ({title, subtitle}) => {
  return (
    <SheetHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
    <div>
      <SheetTitle className="text-2xl font-medium">{title}</SheetTitle>
      <p className="text-sm text-muted-foreground">
       {subtitle}
      </p>
    </div>
  </SheetHeader>
  )
}
interface TicketSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyTickets: (tickets: TicketType[]) => void;
}

// Internal component for displaying ticket prices
const TicketPriceDisplay = ({ price, originalPrice, size = "lg", currency }: {
  price: number;
  originalPrice?: number;
  size?: "sm" | "lg" | "xl";
  currency: string;
}) => {
  const sizeClasses = {
    sm: "text-sm",
    lg: "text-xl",
    xl: "text-2xl"
  };

  return (
    <div className="text-right">
      <div className={`${sizeClasses[size]} font-semibold text-foreground`}>
        {formatCurrency(price, currency)}
      </div>
      {/* {originalPrice && (
        <div className="text-sm text-price-accent line-through">
          {formatCurrency(originalPrice, currency)}
        </div>
      )} */}
    </div>
  );
};

const TicketSelectionModal = ({ isOpen, onClose, onBuyTickets }: TicketSelectionModalProps) => {
  const { selectedCurrency } = useCurrency();
  const { prices, loading } = usePrices();
  const { addTicket } = useCart();
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: "premium",
      name: "Premium",
      description: "Ideal For: Senior professionals, investors, entrepreneurs seeking high-level access and exclusive networking",
      price: 0,
      originalPrice: 0,
      quantity: 0,
    },
    {
      id: "standard",
      name: "Standard",
      description: "Ideal For: Professionals, innovators, developers, and enthusiasts keen on comprehensive learning and networking.",
      price: 0,
      originalPrice: 0,
      quantity: 0,
    },
  ]);

  // Update ticket prices when API data changes
  useEffect(() => {
    if (prices) {
      setTickets(prev => prev.map(ticket => ({
        ...ticket,
        price: ticket.id === 'premium' ? prices.premium : prices.standard,
        // Keep original prices for now, or set to undefined if no discount
        originalPrice: undefined,
      })));
    }
  }, [prices]);

  const updateQuantity = (ticketId: string, change: number) => {
    setTickets(prev => prev.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, quantity: Math.max(0, ticket.quantity + change) }
        : ticket
    ));
  };

  const getTotalPrice = () => {
    return tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const getTotalOriginalPrice = () => {
    return tickets.reduce((total, ticket) =>
      total + ((ticket.originalPrice || ticket.price) * ticket.quantity), 0
    );
  };

  const handleBuyTickets = () => {
    // Check if any tickets are selected
    const hasSelectedTickets = tickets.some(ticket => ticket.quantity > 0);
    if (!hasSelectedTickets) {
      alert("Please select at least one ticket");
      return;
    }

    // Add tickets to cart and proceed directly to checkout
    tickets.forEach(ticket => {
      if (ticket.quantity > 0) {
        addTicket(ticket);
      }
    });
    
    // Close modal and trigger checkout flow
    onClose();
    onBuyTickets(tickets);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
          <div>
            <SheetTitle className="text-2xl font-medium">Select Your Tickets</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Kindly select an option below
            </p>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="">

          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4 not-last-of-type:border-b border-gray-200 py-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-2xl text-foreground">{ticket.name}</h3>
                    <TicketPriceDisplay
                      price={ticket.price}
                      originalPrice={ticket.originalPrice}
                      size="lg"
                      currency={selectedCurrency}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ticket.description}
                  </p>
                </div>
                {/* <div className="ml-4">
                  <TicketPriceDisplay
                    price={ticket.price}
                    originalPrice={ticket.originalPrice}
                    size="lg"
                  />
                </div> */}
              </div>

              <div className="flex items-center justify-start gap-4 border border-gray-200 rounded-2xl w-fit">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(ticket.id, -1)}
                  disabled={ticket.quantity === 0}
                  className="w-8 h-8 p-0 flex justify-center items-center rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold text-lg w-8 text-center">
                  {ticket.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(ticket.id, 1)}
                   className="w-8 h-8 p-0 flex justify-center items-center rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="flex-shrink-0 border-t pt-4 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-normal text-foreground">Total</span>
            <TicketPriceDisplay
              price={getTotalPrice()}
              originalPrice={getTotalOriginalPrice()}
              size="xl"
              currency={selectedCurrency}
            />
          </div>

          <PrimaryButton
            onClick={handleBuyTickets}
          >
            Proceed to Buy Ticket
          </PrimaryButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketSelectionModal;