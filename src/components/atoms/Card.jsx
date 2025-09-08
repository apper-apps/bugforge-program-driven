import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ className, hover = false, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-md",
        hover && "card-hover cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;