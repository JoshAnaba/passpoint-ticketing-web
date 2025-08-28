import { useState } from "react";
import Header from "./Header";
import EventDetails from "./EventDetails";
import EventInfo from "./EventInfo";
import TicketSelectionModal from "./TicketSelectionModal";
import CartModal from "./CartModal";
import CheckoutModal from "./CheckoutModal";

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

const TicketingPage = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [cartTickets, setCartTickets] = useState<TicketType[]>([]);

  const handleSelectTickets = () => {
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
  };

  const handleBuyTickets = (tickets: TicketType[]) => {
    setCartTickets(tickets);
    setIsTicketModalOpen(false);
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  const handleRemoveTicket = (ticketId: string) => {
    setCartTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, quantity: 0 } : ticket
    ));
  };

  const handleProceedToCheckout = () => {
    setIsCartModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
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
        isOpen={isTicketModalOpen} 
        onClose={handleCloseTicketModal}
        onBuyTickets={handleBuyTickets}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={handleCloseCartModal}
        tickets={cartTickets}
        onRemoveTicket={handleRemoveTicket}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
        tickets={cartTickets}
      />
    </div>
  );
};

export default TicketingPage;