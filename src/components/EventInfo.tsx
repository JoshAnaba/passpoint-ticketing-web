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
    <div className="space-y-6 border-l border-[#E5E7EF] [&>div]:p-8 [&>div]:border-b [&>div]:border-gray-200 [&>div:last-child]:border-b-0">
      <div>
        <span className="mb-4 text-sm text-ticket-standard border-ticket-standard underline tracking-widest">
          ABF COLLABORATION
        </span>
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Africa Blockchain Festival 2025
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Join 3,000+ leaders, innovators, and policymakers in Kigali, Rwanda, for
          Africa's premier tech event focused on blockchain, AI, policy, and
          investment. Shift the narrative, build the future.
        </p>
      </div>

      <div className="">
        <h3 className="font-normal tracking-widest text-foreground mb-4 text-[#565C69]">EVENT DETAILS</h3>
        <div className="space-y-2 [&>div]:border [&>div]:border-[#E5E7EF] [&>div]:rounded-3xl [&>div]:p-2">
          <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 2V5" stroke="#009EC4" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 2V5" stroke="#009EC4" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 3.5C19.33 3.68 21 4.95 21 9.65V15.83C21 19.95 20 22.01 15 22.01H9C4 22.01 3 19.95 3 15.83V9.65C3 4.95 4.67 3.69 8 3.5H16Z" stroke="#009EC4" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.75 17.6H3.25" stroke="#009EC4" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 8.25C10.77 8.25 9.73 8.92 9.73 10.22C9.73 10.84 10.02 11.31 10.46 11.61C9.85 11.97 9.5 12.55 9.5 13.23C9.5 14.47 10.45 15.24 12 15.24C13.54 15.24 14.5 14.47 14.5 13.23C14.5 12.55 14.15 11.96 13.53 11.61C13.98 11.3 14.26 10.84 14.26 10.22C14.26 8.92 13.23 8.25 12 8.25ZM12 11.09C11.48 11.09 11.1 10.78 11.1 10.29C11.1 9.79 11.48 9.5 12 9.5C12.52 9.5 12.9 9.79 12.9 10.29C12.9 10.78 12.52 11.09 12 11.09ZM12 14C11.34 14 10.86 13.67 10.86 13.07C10.86 12.47 11.34 12.15 12 12.15C12.66 12.15 13.14 12.48 13.14 13.07C13.14 13.67 12.66 14 12 14Z" fill="#009EC4"/>
</svg>


            {/* <Calendar className="w-5 h-5 text-ticket-standard" /> */}
            <span className="text-foreground font-medium">Nov 7, 2025 - Nov 10, 2025</span>
          </div>
          <div className="flex items-center gap-3">
            {/* <Clock className="w-5 h-5 text-ticket-standard" /> */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="#009EC4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.7089 15.18L12.6089 13.33C12.0689 13.01 11.6289 12.24 11.6289 11.61V7.51001" stroke="#009EC4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            <span className="text-foreground font-medium">3:00 PM - 3:00 AM (Africa/Lagos)</span>
          </div>
          <div className="flex items-center gap-3">
            {/* <MapPin className="w-5 h-5 text-ticket-standard" /> */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9989 13.4299C13.722 13.4299 15.1189 12.0331 15.1189 10.3099C15.1189 8.58681 13.722 7.18994 11.9989 7.18994C10.2758 7.18994 8.87891 8.58681 8.87891 10.3099C8.87891 12.0331 10.2758 13.4299 11.9989 13.4299Z" stroke="#009EC4" stroke-width="1.5"/>
<path d="M3.62166 8.49C5.59166 -0.169998 18.4217 -0.159997 20.3817 8.5C21.5317 13.58 18.3717 17.88 15.6017 20.54C13.5917 22.48 10.4117 22.48 8.39166 20.54C5.63166 17.88 2.47166 13.57 3.62166 8.49Z" stroke="#009EC4" stroke-width="1.5"/>
</svg>

            <span className="text-foreground font-medium">Kigali Convention Centre, Kigali, Rwanda</span>
          </div>
        </div>
      </div>
 
      <div className="flex lg:flex-row flex-col justify-between">
        <div className="lg:min-w-[240px]">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Select Currency
          </label>
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full rounded-xl h-12">
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

        <div className="flex flex-col lg:items-end justify-between">
          <div className="text-3xl font-semibold text-foreground">
            {currency === "NGN" ? "₦" : "$"}{price}
          </div>
          {currency === "NGN" && (
            <div className="text-price-accent font-medium line-through">
              ₦287,604.26
            </div>
          )}
        </div>


      </div>
      <div className="cta flex flex-col gap-3">
        <Button
          onClick={onSelectTickets}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-normal min-h-12 rounded-xl"
        >
          Proceed To Buy Tickets
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.44141 13.28L10.7881 8.9333C11.3014 8.41997 11.3014 7.57997 10.7881 7.06664L6.44141 2.71997" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </Button>

        <p className="text-xs text-muted-foreground text-center">
          * Full details of the event will be shared after purchase
        </p>
      </div>
    </div>
  );
};

export default EventInfo;