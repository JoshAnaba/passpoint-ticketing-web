import { Button } from "@/components/ui/button";
import clsx from "clsx";

const PrimaryButton = ({onClick, children, className=""}) => {
  return (
    <Button
    onClick={onClick}
    className={clsx("w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-normal min-h-12 rounded-xl", className)}
  >
   {children}
  </Button>

  )
}

export default PrimaryButton
