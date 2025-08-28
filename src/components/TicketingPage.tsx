import { useState } from "react";
import Header from "./Header";
import EventDetails from "./EventDetails";
import EventInfo from "./EventInfo";
import TicketSelectionModal from "./TicketSelectionModal";

const TicketingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectTickets = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left side - Event Details */}
          <div className="lg:col-span-2">
            <EventDetails />
          </div>

          {/* Right side - Event Info and Booking */}
          <div className="lg:col-span-1">
            <EventInfo onSelectTickets={handleSelectTickets} />
          </div>
        </div>
      </main>

      <TicketSelectionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default TicketingPage;