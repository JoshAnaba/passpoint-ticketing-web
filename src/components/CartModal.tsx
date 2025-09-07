import { X, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { useCart, useCurrency } from "@/context";
import PrimaryButton from "./PrimaryButton";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

const CartModal = ({ isOpen, onClose, onProceedToCheckout }: CartModalProps) => {
  const { tickets, removeTicket } = useCart();
  const { selectedCurrency } = useCurrency();
  const selectedTickets = tickets.filter(ticket => ticket.quantity > 0);

  const getTotalPrice = () => {
    return selectedTickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const getTotalOriginalPrice = () => {
    return selectedTickets.reduce((total, ticket) => 
      total + ((ticket.originalPrice || ticket.price) * ticket.quantity), 0
    );
  };

  const handleProceedToCheckout = () => {
    if (selectedTickets.length === 0) return;
    onProceedToCheckout();
    onClose();
  };

  const handleRemoveTicket = (ticketId: string) => {
    removeTicket(ticketId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
        <div>
            <SheetTitle className="text-2xl font-medium">Cart Page</SheetTitle>
            <p className="text-sm text-muted-foreground">
            These are tickets in your cart
            </p>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          {selectedTickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <>
              {selectedTickets.map((ticket) => (
                <Card key={ticket.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Event Image Placeholder */}
                    <div className="w-16 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-md flex-shrink-0 flex items-center justify-center">
                      <div className="text-xs font-bold text-primary">Event</div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        Africa Blockchain Festival 2025
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {ticket.name} ({ticket.quantity}x)
                        </span>
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                          Standard ({ticket.quantity}x)
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-lg font-bold text-foreground">
                          {formatCurrency(ticket.price * ticket.quantity, selectedCurrency)}
                        </div>
                        {ticket.originalPrice && (
                          <div className="text-sm text-price-accent line-through">
                            {formatCurrency(ticket.originalPrice * ticket.quantity, selectedCurrency)}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTicket(ticket.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Total Section */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(getTotalPrice(), selectedCurrency)}
                    </div>
                    {getTotalOriginalPrice() > getTotalPrice() && (
                      <div className="text-sm text-price-accent line-through">
                        {formatCurrency(getTotalOriginalPrice(), selectedCurrency)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <PrimaryButton 
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </PrimaryButton>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;