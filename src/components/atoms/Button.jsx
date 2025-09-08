import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 focus:ring-primary shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-secondary to-purple-600 text-white hover:from-secondary/90 hover:to-purple-600/90 focus:ring-secondary shadow-lg hover:shadow-xl",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary hover:border-primary",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-primary",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-success/90 hover:to-green-600/90 focus:ring-success shadow-lg hover:shadow-xl",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-error/90 hover:to-red-600/90 focus:ring-error shadow-lg hover:shadow-xl",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;