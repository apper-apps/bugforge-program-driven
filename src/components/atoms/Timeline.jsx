import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Timeline = ({ items = [], className }) => {
  if (!items.length) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        <ApperIcon name="Clock" className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No timeline events yet</p>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-4"
          >
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white relative z-10",
              item.type === 'created' && "bg-blue-500",
              item.type === 'status_change' && "bg-amber-500", 
              item.type === 'assigned' && "bg-green-500",
              item.type === 'comment' && "bg-purple-500",
              item.type === 'updated' && "bg-gray-500"
            )}>
              <ApperIcon 
                name={
                  item.type === 'created' ? 'Plus' :
                  item.type === 'status_change' ? 'ArrowRight' :
                  item.type === 'assigned' ? 'User' :
                  item.type === 'comment' ? 'MessageCircle' :
                  'Edit'
                } 
                className="w-5 h-5" 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </h4>
                  <time className="text-xs text-gray-500">
                    {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
                  </time>
                </div>
                
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {item.description}
                  </p>
                )}
                
                {item.details && (
                  <div className="text-xs text-gray-500 space-y-1">
                    {Object.entries(item.details).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {item.user && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                    <ApperIcon name="User" className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{item.user}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;