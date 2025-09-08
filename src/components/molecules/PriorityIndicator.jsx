import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const PriorityIndicator = ({ priority, showLabel = false, size = "default" }) => {
  const getPriorityConfig = () => {
    const configs = {
      critical: { 
        color: "bg-gradient-to-r from-error to-red-600", 
        textColor: "text-error",
        icon: "AlertTriangle",
        label: "Critical" 
      },
      high: { 
        color: "bg-gradient-to-r from-warning to-amber-600", 
        textColor: "text-warning",
        icon: "ArrowUp",
        label: "High" 
      },
      medium: { 
        color: "bg-gradient-to-r from-info to-blue-600", 
        textColor: "text-info",
        icon: "Minus",
        label: "Medium" 
      },
      low: { 
        color: "bg-gradient-to-r from-gray-400 to-gray-500", 
        textColor: "text-gray-500",
        icon: "ArrowDown",
        label: "Low" 
      }
    };
    return configs[priority] || configs.medium;
  };

  const config = getPriorityConfig();
  const sizeClasses = {
    sm: "w-2 h-2",
    default: "w-3 h-3",
    lg: "w-4 h-4"
  };

  if (showLabel) {
    return (
      <div className="inline-flex items-center gap-2">
        <div className={cn("rounded-full", config.color, sizeClasses[size])}></div>
        <span className={cn("text-sm font-medium", config.textColor)}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={cn("rounded-full", config.color, sizeClasses[size])}
      title={`${config.label} Priority`}
    ></div>
  );
};

export default PriorityIndicator;