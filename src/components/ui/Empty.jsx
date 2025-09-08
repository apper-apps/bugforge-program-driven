import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item",
  actionText = "Create New",
  onAction,
  icon = "FileText"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-6 mb-6">
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-gray-400" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;