import { Calendar, Clock, MapPin, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface EventInfoProps {
  onSelectTickets: () => void;
}

const EventInfo = ({ onSelectTickets }: EventInfoProps) => {
  const [currency, setCurrency] = useState("NGN");
  const [price, setPrice] = useState("215,703.19");

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    // Update price based on currency
    if (value === "USD") {
      setPrice("500.00");
    } else {
      setPrice("215,703.19");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 text-ticket-standard border-ticket-standard">
          ABF COLLABORATION
        </Badge>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Africa Blockchain Festival 2025
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Join 3,000+ leaders, innovators, and policymakers in Kigali, Rwanda, for 
          Africa's premier tech event focused on blockchain, AI, policy, and 
          investment. Shift the narrative, build the future.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">EVENT DETAILS</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-ticket-standard" />
            <span className="text-foreground font-medium">Nov 7, 2025 - Nov 10, 2025</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-ticket-standard" />
            <span className="text-foreground font-medium">3:00 PM - 3:00 AM (Africa/Lagos)</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-ticket-standard" />
            <span className="text-foreground font-medium">Kigali Convention Centre, Kigali, Rwanda</span>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Select Currency
          </label>
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <div className="w-5 h-3 bg-success rounded-sm"></div>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-foreground">
            {currency === "NGN" ? "₦" : "$"}{price}
          </div>
          {currency === "NGN" && (
            <div className="text-price-accent font-medium">
              ₦287,604.26
            </div>
          )}
        </div>

        <Button 
          onClick={onSelectTickets}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-semibold"
        >
          Proceed To Buy Tickets →
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          * Full details of the event will be shared after purchase
        </p>
      </div>
    </div>
  );
};

export default EventInfo;