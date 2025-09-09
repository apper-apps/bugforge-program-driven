import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const BugModal = ({ isOpen, onClose, onSave, bug, projects }) => {
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    severity: "medium",
    priority: "medium",
    assignee: "",
    reporter: "",
    reproductionSteps: [""]
  });

  useEffect(() => {
    if (bug) {
      setFormData({
        projectId: bug.projectId || "",
        title: bug.title || "",
        description: bug.description || "",
        severity: bug.severity || "medium",
        priority: bug.priority || "medium",
        assignee: bug.assignee || "",
        reporter: bug.reporter || "",
        reproductionSteps: bug.reproductionSteps || [""]
      });
    } else {
      setFormData({
        projectId: "",
        title: "",
        description: "",
        severity: "medium",
        priority: "medium",
        assignee: "",
        reporter: "",
        reproductionSteps: [""]
      });
    }
  }, [bug]);

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
    
    if (!formData.reporter.trim()) {
      toast.error("Reporter is required");
      return;
    }

    const filteredSteps = formData.reproductionSteps.filter(step => step.trim());
    
    try {
      await onSave({
        ...formData,
        reproductionSteps: filteredSteps,
        attachments: []
      });
      
      toast.success(bug ? "Bug updated successfully" : "Bug reported successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save bug report");
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      reproductionSteps: [...formData.reproductionSteps, ""]
    });
  };

  const removeStep = (index) => {
    if (formData.reproductionSteps.length > 1) {
      const newSteps = formData.reproductionSteps.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        reproductionSteps: newSteps
      });
    }
  };

  const updateStep = (index, value) => {
    const newSteps = [...formData.reproductionSteps];
    newSteps[index] = value;
    setFormData({
      ...formData,
      reproductionSteps: newSteps
    });
  };

  const commonAssignees = [
    "John Smith",
    "Sarah Johnson",
    "Mike Chen",
    "Lisa Wong",
    "David Kim",
    "Emma Davis",
    "Tom Wilson",
    "Alex Rodriguez",
    "Jennifer Lee",
    "Rachel Green",
    "Mark Thompson"
  ];

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
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {bug ? "Edit Bug Report" : "Report New Bug"}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      Severity *
                    </label>
                    <Select
                      value={formData.severity}
                      onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Brief description of the bug"
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
                    placeholder="Detailed description of the bug and its impact"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignee
                    </label>
                    <Select
                      value={formData.assignee}
                      onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                    >
                      <option value="">Unassigned</option>
                      {commonAssignees.map(assignee => (
                        <option key={assignee} value={assignee}>
                          {assignee}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reporter *
                    </label>
                    <Select
                      value={formData.reporter}
                      onChange={(e) => setFormData({...formData, reporter: e.target.value})}
                      required
                    >
                      <option value="">Select reporter</option>
                      {commonAssignees.map(reporter => (
                        <option key={reporter} value={reporter}>
                          {reporter}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Reproduction Steps
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
                    {formData.reproductionSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 w-8">
                          {index + 1}.
                        </span>
                        <Input
                          value={step}
                          onChange={(e) => updateStep(index, e.target.value)}
                          placeholder={`Step ${index + 1} to reproduce the bug`}
                          className="flex-1"
                        />
                        {formData.reproductionSteps.length > 1 && (
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
                  {bug ? "Update" : "Report"} Bug
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BugModal;