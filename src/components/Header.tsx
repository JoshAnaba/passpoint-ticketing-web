import { HelpCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="relative overflow-hidden">
      <div className="h-2 bg-gradient-primary"></div>
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-ticket-premium">Passpoint</h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Need help? support@passpoint.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;