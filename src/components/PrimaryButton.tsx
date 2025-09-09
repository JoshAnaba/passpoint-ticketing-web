import { Button } from "@/components/ui/button";
import clsx from "clsx";

const PrimaryButton = ({onClick, children, className="", loading=false, disabled=false}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx("w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-normal min-h-12 rounded-xl", className)}
    >
      {loading && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
      )}
      {children}
    </Button>
  )
}

export default PrimaryButton
