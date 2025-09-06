import { HelpCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import PasspointLogo from "./PasspointLogo";
import headerGradient from "@/assets/header-gradient.jpg";

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

interface HeaderProps {
  cartTickets: TicketType[];
  onOpenCart: () => void;
}

const Header = ({ cartTickets, onOpenCart }: HeaderProps) => {
  return (
    <header className="relative overflow-hidden">
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            {/* <h1 className="text-2xl font-bold text-ticket-premium">Passpoint</h1> */}
         <PasspointLogo />

          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">Cart</span>
              {cartTickets.filter(ticket => ticket.quantity > 0).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartTickets.reduce((total, ticket) => total + ticket.quantity, 0)}
                </span>
              )}
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Need help? support@passpoint.com</span>
            </div>
          </div>
        </div>
      </div>
      <img src={headerGradient} alt="Event Logo" className="w-full h-auto" />
      {/* <div className="h-2 bg-gradient-primary"></div> */}
    </header>
  );
};

export default Header;