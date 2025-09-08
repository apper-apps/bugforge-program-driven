import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from '@/components/atoms/Timeline';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const BugTimeline = ({ bug, isOpen, onClose, className }) => {
  const timelineItems = useMemo(() => {
    if (!bug) return [];
    
    const items = [];
    
    // Bug creation event
    items.push({
      id: 'created',
      type: 'created',
      title: 'Bug Report Created',
      description: `"${bug.title}" was reported`,
      timestamp: bug.createdAt,
      user: bug.reporter,
      details: {
        severity: bug.severity,
        priority: bug.priority,
        project: `Project ID: ${bug.projectId}`
      }
    });
    
    // Initial assignment if exists
    if (bug.assignee && bug.createdAt !== bug.updatedAt) {
      items.push({
        id: 'assigned',
        type: 'assigned', 
        title: 'Bug Assigned',
        description: `Assigned to ${bug.assignee}`,
        timestamp: bug.updatedAt,
        user: 'System',
        details: {
          assignee: bug.assignee
        }
      });
    }
    
    // Status changes (inferred from current status if updated)
    if (bug.status !== 'new' && bug.createdAt !== bug.updatedAt) {
      items.push({
        id: 'status_change',
        type: 'status_change',
        title: 'Status Changed',
        description: `Status updated to ${bug.status.replace('-', ' ')}`,
        timestamp: bug.updatedAt,
        user: bug.assignee || 'System',
        details: {
          'new status': bug.status.replace('-', ' '),
          'current assignee': bug.assignee || 'Unassigned'
        }
      });
    }
    
    // Add timeline entries from bug.timeline if they exist
    if (bug.timeline && Array.isArray(bug.timeline)) {
      bug.timeline.forEach((entry, index) => {
        items.push({
          id: `timeline_${index}`,
          ...entry
        });
      });
    }
    
    // Sort by timestamp
    return items.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [bug]);

  if (!bug) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn("border-t border-gray-200 bg-gray-50", className)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Bug Timeline
                </h3>
                <span className="text-sm text-gray-500">
                  ({timelineItems.length} events)
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="ChevronUp" className="w-4 h-4" />
                Hide Timeline
              </Button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Timeline items={timelineItems} />
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Created</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>Status Change</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Assignment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Comment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Update</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BugTimeline;