import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import BugTimeline from "@/components/organisms/BugTimeline";
import ApperIcon from "@/components/ApperIcon";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import StatusBadge from "@/components/molecules/StatusBadge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
const BugCard = ({ bug, onEdit, onDelete, onStatusChange }) => {
  const [showTimeline, setShowTimeline] = useState(false);
  const getNextStatus = () => {
    const statusFlow = {
      "new": "assigned",
      "assigned": "in-progress", 
      "in-progress": "testing",
      "testing": "resolved",
      "resolved": "closed"
    };
    return statusFlow[bug.status];
  };

  const nextStatus = getNextStatus();
const toggleTimeline = () => {
    setShowTimeline(!showTimeline);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="p-6">
<div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTimeline}
              className="text-gray-500 hover:text-gray-700 p-2"
              title={showTimeline ? "Hide Timeline" : "Show Timeline"}
            >
              <ApperIcon name="Clock" className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-start gap-3">
            <PriorityIndicator priority={bug.severity} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {bug.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {bug.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <StatusBadge status={bug.status} type="bug" />
          <PriorityIndicator priority={bug.severity} showLabel size="sm" />
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Reporter:</span>
            <span className="text-gray-900">{bug.reporter}</span>
          </div>
          {bug.assignee && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Assignee:</span>
              <span className="text-gray-900">{bug.assignee}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Created:</span>
<span className="text-gray-900">
              {bug.createdAt && !isNaN(new Date(bug.createdAt)) 
                ? format(new Date(bug.createdAt), "MMM d, yyyy")
                : "Invalid date"}
            </span>
          </div>
          {bug.attachments?.length > 0 && (
            <div className="flex items-center gap-2">
              <ApperIcon name="Paperclip" className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {bug.attachments.length} attachment(s)
              </span>
            </div>
          )}
</div>
        
        <BugTimeline 
          bug={bug}
          isOpen={showTimeline}
          onClose={() => setShowTimeline(false)}
        />
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(bug)}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(bug.Id)}
              className="text-error hover:bg-error/10 inline-flex items-center gap-2"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              Delete
            </Button>
          </div>
          
          {nextStatus && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusChange(bug.Id, nextStatus)}
              className="inline-flex items-center gap-2 capitalize"
            >
              <ApperIcon name="ArrowRight" className="w-4 h-4" />
              {nextStatus.replace("-", " ")}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default BugCard;