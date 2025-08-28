import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: TicketType[];
}

interface ContactInfo {
  fullName: string;
  email: string;
  sendToMultiple: boolean;
}

const CheckoutModal = ({ isOpen, onClose, tickets }: CheckoutModalProps) => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: "",
    email: "",
    sendToMultiple: false,
  });

  const [ticketContactInfo, setTicketContactInfo] = useState<Record<string, ContactInfo>>({});
  const [expandedTickets, setExpandedTickets] = useState<Record<string, boolean>>({});

  const getTotalPrice = () => {
    return tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const getTotalOriginalPrice = () => {
    return tickets.reduce((total, ticket) => 
      total + ((ticket.originalPrice || ticket.price) * ticket.quantity), 0
    );
  };

  const handleContactInfoChange = (field: keyof ContactInfo, value: string | boolean) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleTicketContactChange = (ticketId: string, field: keyof ContactInfo, value: string | boolean) => {
    setTicketContactInfo(prev => ({
      ...prev,
      [ticketId]: { ...prev[ticketId], [field]: value }
    }));
  };

  const toggleTicketExpansion = (ticketId: string) => {
    setExpandedTickets(prev => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };

  const handleContinueToPayment = () => {
    // Basic validation
    if (!contactInfo.fullName || !contactInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your contact information.",
        variant: "destructive",
      });
      return;
    }

    // Simulate payment processing
    toast({
      title: "Processing Payment",
      description: "Redirecting to payment gateway...",
    });
    
    // In a real app, this would redirect to payment processor
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: "Your tickets have been purchased successfully.",
      });
      onClose();
    }, 2000);
  };

  const selectedTickets = tickets.filter(ticket => ticket.quantity > 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <SheetTitle className="text-xl font-bold text-foreground">Secure Checkout</SheetTitle>
            <p className="text-sm text-muted-foreground">Complete your ticket purchase</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </SheetHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact Info</h3>
            
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter Your Full Name"
                value={contactInfo.fullName}
                onChange={(e) => handleContactInfoChange("fullName", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Your Email Address"
                value={contactInfo.email}
                onChange={(e) => handleContactInfoChange("email", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendToMultiple"
                checked={contactInfo.sendToMultiple}
                onCheckedChange={(checked) => handleContactInfoChange("sendToMultiple", checked as boolean)}
              />
              <Label htmlFor="sendToMultiple" className="text-sm text-foreground">
                Send receipt to multiple persons
              </Label>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-4">
            {selectedTickets.map((ticket) => (
              <Collapsible
                key={ticket.id}
                open={expandedTickets[ticket.id]}
                onOpenChange={() => toggleTicketExpansion(ticket.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="text-left">
                      <p className="font-medium text-foreground">
                        {ticket.name} Tickets : Africa Blockchain Festival 2025
                      </p>
                    </div>
                    {expandedTickets[ticket.id] ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="px-3 pb-3 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Full Name
                    </Label>
                    <Input
                      placeholder="Enter Your Full Name"
                      value={ticketContactInfo[ticket.id]?.fullName || ""}
                      onChange={(e) => handleTicketContactChange(ticket.id, "fullName", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter Your Email Address"
                      value={ticketContactInfo[ticket.id]?.email || ""}
                      onChange={(e) => handleTicketContactChange(ticket.id, "email", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
            
            {selectedTickets.map((ticket) => (
              <div key={ticket.id} className="flex justify-between items-center">
                <span className="text-sm text-foreground">
                  {ticket.name} ({ticket.quantity}x)
                </span>
                <span className="text-sm font-medium text-foreground">
                  ₦{(ticket.price * ticket.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground">
                    ₦{getTotalPrice().toLocaleString()}
                  </div>
                  {getTotalOriginalPrice() > getTotalPrice() && (
                    <div className="text-sm text-price-accent line-through">
                      ₦{getTotalOriginalPrice().toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleContinueToPayment}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-semibold"
          >
            Continue to Payment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CheckoutModal;