import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

interface BottomProps {
  children: React.ReactNode;
}

const SideModal = ({ isOpen, onClose, title, subtitle, children }: SideModalProps) => {
  // Find the Bottom component among children
  const childrenArray = React.Children.toArray(children);
  const bottomChild = childrenArray.find((child: any) => 
    React.isValidElement(child) && child.type === Bottom
  );
  const otherChildren = childrenArray.filter((child: any) => 
    !(React.isValidElement(child) && child.type === Bottom)
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
          <div>
            <SheetTitle className="text-2xl font-medium">{title}</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto">
          {otherChildren}
        </div>

        {bottomChild && (
          <div className="flex-shrink-0 border-t pt-4 space-y-4">
            {bottomChild.props.children}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Bottom component that can be used as a child
const Bottom: React.FC<BottomProps> = ({ children }) => {
  // This component doesn't render anything itself
  // It's just a marker for the SideModal to find and extract
  return null;
};


// Attach Bottom to SideModal for easier access
SideModal.Bottom = Bottom;

export default SideModal;
