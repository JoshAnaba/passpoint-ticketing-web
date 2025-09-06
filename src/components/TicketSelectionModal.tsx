import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TicketSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyTickets: (tickets: TicketType[]) => void;
}

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

// Internal component for displaying ticket prices
const TicketPriceDisplay = ({ price, originalPrice, size = "lg" }: {
  price: number;
  originalPrice?: number;
  size?: "sm" | "lg" | "xl"
}) => {
  const sizeClasses = {
    sm: "text-sm",
    lg: "text-xl",
    xl: "text-2xl"
  };

  return (
    <div className="text-right">
      <div className={`${sizeClasses[size]} font-semibold text-foreground`}>
        ₦{price.toLocaleString()}
      </div>
      {originalPrice && (
        <div className="text-sm text-price-accent line-through">
          ₦{originalPrice.toLocaleString()}
        </div>
      )}
    </div>
  );
};

const TicketSelectionModal = ({ isOpen, onClose, onBuyTickets }: TicketSelectionModalProps) => {
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: "premium",
      name: "Premium",
      description: "Ideal For: Senior professionals, investors, entrepreneurs seeking high-level access and exclusive networking",
      price: 431406.39,
      originalPrice: 539257.98,
      quantity: 0,
    },
    {
      id: "standard",
      name: "Standard",
      description: "Ideal For: Professionals, innovators, developers, and enthusiasts keen on comprehensive learning and networking.",
      price: 215703.19,
      originalPrice: 287604.26,
      quantity: 0,
    },
  ]);

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

    // Pass tickets to parent for cart/checkout flow
    onBuyTickets(tickets);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
          <div>
            <SheetTitle className="text-2xl font-semibold">Select Your Tickets</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Kindly select an option below
            </p>
          </div>
          {/* <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button> */}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">

          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-2xl text-foreground">{ticket.name}</h3>
                    <TicketPriceDisplay
                      price={ticket.price}
                      originalPrice={ticket.originalPrice}
                      size="lg"
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

              <div className="flex items-center justify-start gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(ticket.id, -1)}
                  disabled={ticket.quantity === 0}
                  className="w-8 h-8 p-0 flex justify-center items-center"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold text-lg w-8 text-center">
                  {ticket.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(ticket.id, 1)}
                   className="w-8 h-8 p-0 flex justify-center items-center"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
          </div>
        </div>

        <div className="flex-shrink-0 border-t pt-4 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-foreground">Total</span>
            <TicketPriceDisplay
              price={getTotalPrice()}
              originalPrice={getTotalOriginalPrice()}
              size="xl"
            />
          </div>

          <Button
            onClick={handleBuyTickets}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-semibold"
          >
            Add to Cart
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketSelectionModal;