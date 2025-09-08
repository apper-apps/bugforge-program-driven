import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-purple-600/10 text-secondary border border-secondary/20",
    success: "bg-gradient-to-r from-success/10 to-green-600/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-amber-600/10 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-600/10 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/10 to-blue-500/10 text-info border border-info/20",
  };
  
  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;