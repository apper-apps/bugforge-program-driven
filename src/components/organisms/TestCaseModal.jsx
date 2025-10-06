import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const TestCaseModal = ({ isOpen, onClose, onSave, testCase, projects }) => {
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    steps: [""],
    expectedResult: "",
    priority: "medium"
  });

  useEffect(() => {
if (testCase) {
      setFormData({
        projectId: testCase.project_id_c ? testCase.project_id_c.toString() : "",
        title: testCase.title_c || "",
        description: testCase.description_c || "",
steps: testCase.steps_c ? (Array.isArray(testCase.steps_c) ? testCase.steps_c : (typeof testCase.steps_c === 'string' ? (() => { try { return JSON.parse(testCase.steps_c); } catch { return [testCase.steps_c]; } })() : [""])) : [""],
        expectedResult: testCase.expected_result_c || "",
        priority: testCase.priority_c || "medium"
      });
    } else {
      setFormData({
        projectId: "",
        title: "",
        description: "",
        steps: [""],
        expectedResult: "",
        priority: "medium"
      });
    }
  }, [testCase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!formData.projectId) {
      toast.error("Please select a project");
      return;
    }

    const filteredSteps = formData.steps.filter(step => step.trim());
    
    try {
      await onSave({
        ...formData,
        steps: filteredSteps
      });
      
      toast.success(testCase ? "Test case updated successfully" : "Test case created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save test case");
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, ""]
    });
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        steps: newSteps
      });
    }
  };

  const updateStep = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({
      ...formData,
      steps: newSteps
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {testCase ? "Edit Test Case" : "Create New Test Case"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project *
                  </label>
                  <Select
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                    required
                  >
                    <option value="">Select a project</option>
{projects.map(project => (
                      <option key={project.Id} value={project.Id.toString()}>
                        {project.name_c || project.Name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter test case title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe what this test case validates"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Test Steps
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addStep}
                      className="inline-flex items-center gap-2"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                      Add Step
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 w-8">
                          {index + 1}.
                        </span>
                        <Input
                          value={step}
                          onChange={(e) => updateStep(index, e.target.value)}
                          placeholder={`Step ${index + 1}`}
                          className="flex-1"
                        />
                        {formData.steps.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(index)}
                            className="text-error hover:bg-error/10"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Result
                  </label>
                  <Textarea
                    value={formData.expectedResult}
                    onChange={(e) => setFormData({...formData, expectedResult: e.target.value})}
                    placeholder="What should happen when the test is executed correctly"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 p-6 bg-gray-50 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="inline-flex items-center gap-2"
                >
                  <ApperIcon name="Save" className="w-4 h-4" />
                  {testCase ? "Update" : "Create"} Test Case
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TestCaseModal;