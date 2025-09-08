import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import CommentsSection from "@/components/organisms/CommentsSection";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { testCaseService } from "@/services/api/testCaseService";

const TestCaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTestCase();
  }, [id]);

  const loadTestCase = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await testCaseService.getById(id);
      setTestCase(data);
    } catch (err) {
      setError("Failed to load test case details");
      toast.error("Failed to load test case details");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/test-cases");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!testCase) return <Error message="Test case not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          Back to Test Cases
        </Button>
      </div>

      {/* Test Case Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {testCase.title_c || testCase.Name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>ID: TC-{testCase.Id}</span>
                <span>•</span>
                <span>Created {format(new Date(testCase.CreatedOn), 'MMM d, yyyy')}</span>
                <span>•</span>
                <span>Project: {testCase.project_id_c?.Name || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <PriorityIndicator priority={testCase.priority_c} />
              <StatusBadge status={testCase.status_c} type="test-case" />
            </div>
          </div>

          {/* Description */}
          {testCase.description_c && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{testCase.description_c}</p>
            </div>
          )}

          {/* Test Steps */}
          {testCase.steps_c && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Test Steps</h3>
              <div className="space-y-2">
                {testCase.steps_c.split('\n').map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-500 w-8">
                      {index + 1}.
                    </span>
                    <span className="text-gray-700 flex-1">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expected Result */}
          {testCase.expected_result_c && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Expected Result</h3>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{testCase.expected_result_c}</p>
              </div>
            </div>
          )}

          {/* Last Run Info */}
          {testCase.last_run_c && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Last Test Run</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(testCase.last_run_c), 'MMM d, yyyy at h:mm a')}
                  </p>
                </div>
                {testCase.last_result_c && (
                  <StatusBadge status={testCase.last_result_c} type="test-result" />
                )}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6">
          <CommentsSection testCaseId={id} />
        </Card>
      </motion.div>
    </div>
  );
};

export default TestCaseDetails;