import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";
const TestCaseCard = ({ testCase, onEdit, onDelete, onRun }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const isOwner = testCase.createdBy_c?.Id === user?.userId;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="p-6">
<div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <PriorityIndicator priority={testCase.priority_c} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {testCase.title_c || testCase.Name || 'Untitled Test Case'}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {testCase.description_c || 'No description available'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={testCase.status_c} type="testCase" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Steps:</span>
            <span className="font-medium text-gray-900">
              {testCase.steps_c ? testCase.steps_c.split('\n').filter(step => step.trim()).length : 0}
            </span>
          </div>
          
          {testCase.last_run_c && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Run:</span>
                <span className="text-gray-900">
                  {format(new Date(testCase.last_run_c), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Result:</span>
                <StatusBadge status={testCase.last_result_c} type="testResult" />
              </div>
            </>
          )}
        </div>

<div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/test-cases/${testCase.Id}`)}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="MessageCircle" className="w-4 h-4" />
              Comments
            </Button>
{isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(testCase)}
                className="inline-flex items-center gap-2"
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
                Edit
              </Button>
            )}
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(testCase.Id)}
                className="text-error hover:bg-error/10 inline-flex items-center gap-2"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
                Delete
              </Button>
            )}
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