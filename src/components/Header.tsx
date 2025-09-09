import { HelpCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import PasspointLogo from "./PasspointLogo";
import headerGradient from "@/assets/header-gradient.jpg";
import { useCart } from "@/context";

interface HeaderProps {
  onOpenCart: () => void;
}

const Header = ({ onOpenCart }: HeaderProps) => {
  const { totalItems } = useCart();
  const location = useLocation();
  
  return (
    <header className="relative overflow-hidden">
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <PasspointLogo />
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            {/* <nav className="hidden md:flex items-center gap-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/abf2025" 
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/abf2025' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ABF 2025
              </Link>
            </nav> */}

            {/* Cart Button - only show on event pages */}
            {/* {location.pathname === '/abf2025' && ( */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenCart}
                className="relative flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            {/* )} */}

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