import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import ApperIcon from "@/components/ApperIcon";

const TestCaseCard = ({ testCase, onEdit, onDelete, onRun }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <PriorityIndicator priority={testCase.priority} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {testCase.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {testCase.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={testCase.status} type="testCase" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Steps:</span>
            <span className="font-medium text-gray-900">
              {testCase.steps?.length || 0}
            </span>
          </div>
          
          {testCase.lastRun && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Run:</span>
                <span className="text-gray-900">
                  {format(new Date(testCase.lastRun), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Result:</span>
                <StatusBadge status={testCase.lastResult} type="testResult" />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(testCase)}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(testCase.Id)}
              className="text-error hover:bg-error/10 inline-flex items-center gap-2"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              Delete
            </Button>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRun(testCase.Id)}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Play" className="w-4 h-4" />
            Run Test
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TestCaseCard;