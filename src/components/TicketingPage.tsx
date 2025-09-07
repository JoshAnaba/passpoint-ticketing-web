import { useState } from "react";
import Header from "./Header";
import EventDetails from "./EventDetails";
import EventInfo from "./EventInfo";
import TicketSelectionModal from "./TicketSelectionModal";
import CartModal from "./CartModal";
import CheckoutModal from "./CheckoutModal";
import Footer from "./Footer";
import { useCurrency, useCart } from "@/context";

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
  
  // Use context for currency and cart state
  const { selectedCurrency, setCurrency } = useCurrency();
  const { tickets: cartTickets } = useCart();

  const handleSelectTickets = () => {
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
  };

  const handleBuyTickets = (tickets: TicketType[]) => {
    // Go directly to checkout, bypassing cart
    setIsTicketModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
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
      <Header 
        onOpenCart={() => setIsCartModalOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Event Details */}
          <div className="lg:col-span-1">
            <EventDetails />
          </div>

          {/* Right side - Event Info and Booking */}
          <div className="lg:col-span-1">
            <EventInfo 
              onSelectTickets={handleSelectTickets}
            />
          </div>
        </div>
      </main>

      <Footer />

      <TicketSelectionModal
        isOpen={isTicketModalOpen} 
        onClose={handleCloseTicketModal}
        onBuyTickets={handleBuyTickets}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={handleCloseCartModal}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
      />
    </div>
  );
};

export default TicketingPage;