import { useState, useEffect, useMemo } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";
import { useCart, useCurrency, usePricing } from "@/context";
import PrimaryButton from "./PrimaryButton";
import type { TicketType } from "@/context";
import { initiatePayment, getMerchantId } from "@/services/api";
import { getMerchantApiKey, generateToken } from "@/services/api";

interface ContactInfo {
  fullName: string;
  email: string;
  sendToMultiple: boolean;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { tickets } = useCart();
  const { selectedCurrency } = useCurrency();
  const { selectedCountry } = usePricing();
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: "",
    email: "",
    sendToMultiple: false,
  });

  const [ticketContactInfo, setTicketContactInfo] = useState<Record<string, ContactInfo[]>>({});
  const [expandedTickets, setExpandedTickets] = useState<Record<string, boolean>>({});

  const selectedTickets = useMemo(
    () => tickets.filter(ticket => ticket.quantity > 0),
    [tickets]
  );

  const getTotalPrice = () => {
    return tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const getTotalOriginalPrice = () => {
    return tickets.reduce((total, ticket) =>
      total + ((ticket.originalPrice || ticket.price) * ticket.quantity), 0
    );
  };

  const handleContactInfoChange = (field: keyof ContactInfo, value: string | boolean) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTicketContactChange = (ticketId: string, ticketIndex: number, field: keyof ContactInfo, value: string | boolean) => {
    setTicketContactInfo(prev => {
      const ticketContacts = prev[ticketId] || [];
      const updatedContacts = [...ticketContacts];
      updatedContacts[ticketIndex] = { ...updatedContacts[ticketIndex], [field]: value };
      return {
        ...prev,
        [ticketId]: updatedContacts
      };
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleContinueToPayment = async () => {
    // Basic validation for main contact info only
    if (!contactInfo.fullName || !contactInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your contact information (name and email).",
        variant: "destructive",
      });
      return;
    }

    const amount = getTotalPrice();
    if (amount <= 0) {
      toast({
        title: "No tickets selected",
        description: "Please add at least one ticket before continuing.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      countryCode: selectedCountry,
      amount,
      narration: "Ticket purchase",
      // successUrl: `${window.location.origin}/?status=success`,
      successUrl: `https://mypasspoint.com/?status=success`,
      // failureUrl: `${window.location.origin}/?status=failure`,
      failureUrl: `https://mypasspoint.com/?status=failure`,
      email: contactInfo.email,
      fullName: contactInfo.fullName,
    };

    try {
      setSubmitting(true);
      // 1) Read merchantId (should have been stored during pricing fetch)
      const merchantId = await getMerchantId();
      if (!merchantId) {
        throw new Error("Unable to resolve merchant ID for selected country");
      }

      // 2) Obtain merchant apiKey (cached or fetch)
      let apiKey = localStorage.getItem('merchantApiKey') || undefined;
      if (!apiKey) {
        const credsKey = await getMerchantApiKey(merchantId);
        apiKey = (credsKey as any)?.data?.apiKey as string | undefined;
        if (apiKey) localStorage.setItem('merchantApiKey', apiKey);
      }
      if (!apiKey) {
        throw new Error("Failed to obtain merchant API key");
      }

      // 3) Exchange apiKey for Bearer access token
      const tokenResp = await generateToken(merchantId, apiKey);
      const accessToken = (tokenResp as any)?.data?.accessToken as string | undefined;
      const tokenType = ((tokenResp as any)?.data?.tokenType || 'Bearer') as string;
      if (!accessToken) {
        throw new Error("Failed to obtain access token");
      }

      // 4) Initiate payment with Authorization and x-merchant-id headers
      const data = await initiatePayment(payload, { accessToken, merchantId, tokenType });

      // Try to find a redirect URL field commonly returned by gateways
      const redirectUrl = data?.data?.url || data?.redirectUrl || data?.paymentUrl || data?.data?.redirectUrl || data?.data?.paymentUrl;
      if (redirectUrl) {
        toast({ title: "Redirecting to payment..." });
        window.location.href = redirectUrl as string;
        return;
      }

      toast({
        title: "Payment initiated",
        description: "No redirect URL returned. Please check the response in console.",
      });
      // Fallback: log full response for debugging
      // eslint-disable-next-line no-console
      console.log("initiate-payment response", data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate payment";
      toast({ title: "Payment error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize ticket contact info when component mounts or tickets/sendToMultiple change
  useEffect(() => {
    const newTicketContactInfo: Record<string, ContactInfo[]> = {};
    selectedTickets.forEach(ticket => {
      if (contactInfo.sendToMultiple) {
        newTicketContactInfo[ticket.id] = Array(ticket.quantity).fill(null).map(() => ({
          fullName: "",
          email: "",
          sendToMultiple: false
        }));
      } else {
        newTicketContactInfo[ticket.id] = [{
          fullName: "",
          email: "",
          sendToMultiple: false
        }];
      }
    });
    setTicketContactInfo(newTicketContactInfo);
  }, [selectedTickets, contactInfo.sendToMultiple]);

  // Initialize ticket sections as collapsed by default
  useEffect(() => {
    if (contactInfo.sendToMultiple) {
      const newExpandedTickets: Record<string, boolean> = {};
      selectedTickets.forEach(ticket => {
        for (let i = 0; i < ticket.quantity; i++) {
          newExpandedTickets[`${ticket.id}-${i}`] = false; // Collapsed by default
        }
      });
      setExpandedTickets(newExpandedTickets);
    }
  }, [contactInfo.sendToMultiple, selectedTickets]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
          <div>
            <SheetTitle className="text-2xl font-medium">Secure Checkout</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Complete your ticket purchase
            </p>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Contact Info</h3>

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
          <div className="space-y-2">
            {contactInfo.sendToMultiple ? (
              (() => {
                let ticketCounter = 1;
                const individualTickets: Array<{ ticket: TicketType, index: number, globalIndex: number }> = [];

                selectedTickets.forEach(ticket => {
                  for (let i = 0; i < ticket.quantity; i++) {
                    individualTickets.push({
                      ticket,
                      index: i,
                      globalIndex: ticketCounter++
                    });
                  }
                });

                return individualTickets.map(({ ticket, index, globalIndex }) => {
                  const ticketKey = `${ticket.id}-${index}`;
                  const isOpen = expandedTickets[ticketKey] || false;

                  return (
                    <Collapsible
                      key={ticketKey}
                      open={isOpen}
                      onOpenChange={(open) => {
                        setExpandedTickets(prev => ({
                          ...prev,
                          [ticketKey]: open
                        }));
                      }}
                    >
                      <CollapsibleTrigger asChild>
                        <button className="w-full">
                          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                            <div className="text-left">
                              <p className="font-medium text-foreground">
                                #{globalIndex} {ticket.name} Tickets : Africa Blockchain Festival 2025
                              </p>
                            </div>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="px-3 pb-3 space-y-4">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                              Full Name
                            </Label>
                            <Input
                              placeholder="Enter Full Name"
                              value={ticketContactInfo[ticket.id]?.[index]?.fullName || ""}
                              onChange={(e) => handleTicketContactChange(ticket.id, index, "fullName", e.target.value)}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                              Email Address
                            </Label>
                            <Input
                              type="email"
                              placeholder="Enter Email Address"
                              value={ticketContactInfo[ticket.id]?.[index]?.email || ""}
                              onChange={(e) => handleTicketContactChange(ticket.id, index, "email", e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                });
              })()
            ) : null}
          </div>

          {/* Order Summary */}
          <div className="p-4 space-y-3 bg-[#F4F5F8] rounded-lg">
            <h3 className="text-base font-medium text-foreground">Order Summary</h3>

            {selectedTickets.map((ticket) => (
              <div key={ticket.id} className="flex justify-between items-center">
                <span className="text-sm text-foreground">
                  {ticket.name} ({ticket.quantity}x)
                </span>
                <span className="text-sm font-normal text-foreground">
                  {formatCurrency(ticket.price * ticket.quantity, selectedCurrency)}
                </span>
              </div>
            ))}

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-normal text-foreground">Total</span>
                <div className="text-right">
                  <div className="text-xl font-medium text-foreground">
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
          </div>

          <PrimaryButton
            onClick={handleContinueToPayment}
            disabled={submitting}
          >
            Continue to Payment
          </PrimaryButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CheckoutModal;

