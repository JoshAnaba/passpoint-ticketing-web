import React from 'react';
import SideModal from './SideModal';
import { Button } from '@/components/ui/button';

// Example usage of SideModal with Bottom component
const ExampleModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <SideModal 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      title="Example Modal" 
      subtitle="This is how you use the reusable modal"
    >
      {/* Main content goes here */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Main Content</h3>
        <p className="text-muted-foreground">
          This is the main content area that scrolls if needed.
        </p>
        <div className="mt-4 space-y-2">
          <div className="p-3 border rounded">Item 1</div>
          <div className="p-3 border rounded">Item 2</div>
          <div className="p-3 border rounded">Item 3</div>
        </div>
      </div>

      {/* Bottom content using SideModal.Bottom */}
      <SideModal.Bottom>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total: $100</span>
        </div>
        <Button className="w-full">
          Proceed to Checkout
        </Button>
      </SideModal.Bottom>
    </SideModal>
  );
};

export default ExampleModal;