import { useState } from "react";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import abfBanner from "@/assets/abf-banner.jpg";

const EventDetails = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={handleImageClick}>
        <img src={abfBanner} alt="Event Logo" className="w-full h-auto" />
      </Card>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Event Banner</DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-6 pt-0">
            <img 
              src={abfBanner} 
              alt="Event Banner - Expanded View" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventDetails;