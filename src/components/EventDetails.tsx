import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import venueExterior from "@/assets/venue-exterior.jpg";
import venueInterior from "@/assets/venue-interior.jpg";
import venueHall from "@/assets/venue-hall.jpg";

const EventDetails = () => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Event Logo and Badge */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-3">
              <div className="text-xs font-bold text-center">
                <div>AFRICA</div>
                <div>BLOCKCHAIN</div>
                <div>FESTIVAL</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-price-accent text-white text-xs px-2 py-1">
              VENUE
            </Badge>
          </div>

          {/* Event Title and Images */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Kigali
                </h1>
                <h1 className="text-4xl font-bold text-price-accent mb-4">
                  Convention
                </h1>
                <h1 className="text-4xl font-bold text-price-accent">
                  Center
                </h1>
                
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    AFRICA'S BLOCKCHAIN RENAISSANCE:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    BUILDING A FUTURE OF INNOVATION AND INCLUSION
                  </p>
                  <p className="text-sm text-muted-foreground">
                    7 - 9 NOVEMBER, 2025 | KIGALI, RWANDA
                  </p>
                </div>
              </div>

              {/* Venue Images */}
              <div className="flex gap-2">
                <div className="space-y-2">
                  <img 
                    src={venueExterior} 
                    alt="Convention center exterior" 
                    className="w-32 h-20 object-cover rounded-lg shadow-sm"
                  />
                  <img 
                    src={venueInterior} 
                    alt="Convention center interior" 
                    className="w-32 h-20 object-cover rounded-lg shadow-sm"
                  />
                </div>
                <img 
                  src={venueHall} 
                  alt="Convention center main hall" 
                  className="w-32 h-44 object-cover rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 h-3 bg-gradient-primary rounded-full"></div>
      </div>
    </Card>
  );
};

export default EventDetails;