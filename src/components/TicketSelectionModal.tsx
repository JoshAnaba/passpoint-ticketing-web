import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TicketSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

const TicketSelectionModal = ({ isOpen, onClose }: TicketSelectionModalProps) => {
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: "premium",
      name: "Premium",
      description: "Ideal For: Senior professionals, investors, entrepreneurs seeking high-level access and exclusive networking",
      price: 431406.39,
      originalPrice: 539257.98,
      quantity: 1,
    },
    {
      id: "standard",
      name: "Standard", 
      description: "Ideal For: Professionals, innovators, developers, and enthusiasts keen on comprehensive learning and networking.",
      price: 215703.19,
      originalPrice: 287604.26,
      quantity: 1,
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
    // Simulate checkout process
    alert("Proceeding to checkout...");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
          <SheetTitle className="text-xl font-bold">Select Your Tickets</SheetTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </SheetHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Kindly select an option below
          </p>

          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{ticket.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ticket.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-foreground">
                    ₦{ticket.price.toLocaleString()}
                  </div>
                  {ticket.originalPrice && (
                    <div className="text-sm text-price-accent line-through">
                      ₦{ticket.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(ticket.id, -1)}
                  disabled={ticket.quantity === 0}
                  className="w-8 h-8 p-0"
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
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-foreground">Total</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  ₦{getTotalPrice().toLocaleString()}
                </div>
                <div className="text-sm text-price-accent line-through">
                  ₦{getTotalOriginalPrice().toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleBuyTickets}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-semibold"
          >
            Buy Tickets
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketSelectionModal;