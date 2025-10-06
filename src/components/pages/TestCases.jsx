import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import TestCaseCard from "@/components/organisms/TestCaseCard";
import TestCaseModal from "@/components/organisms/TestCaseModal";
import TestCaseDetails from "@/components/pages/TestCaseDetails";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import useTestCases from "@/hooks/useTestCases";
import useProjects from "@/hooks/useProjects";
import ApperIcon from "@/components/ApperIcon";
const TestCases = () => {
  const { testCases, loading, error, createTestCase, updateTestCase, deleteTestCase, runTestCase, refetch } = useTestCases();
  const { projects } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [runningTestCase, setRunningTestCase] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "deprecated", label: "Deprecated" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = (testCase.title_c || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (testCase.description_c || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || testCase.status_c === statusFilter;
    const matchesPriority = priorityFilter === "all" || testCase.priority_c === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreate = () => {
    setEditingTestCase(null);
    setIsModalOpen(true);
  };

  const handleEdit = (testCase) => {
    setEditingTestCase(testCase);
    setIsModalOpen(true);
  };

  const handleSave = async (testCaseData) => {
    if (editingTestCase) {
      await updateTestCase(editingTestCase.Id, testCaseData);
    } else {
      await createTestCase(testCaseData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test case?")) {
      try {
        await deleteTestCase(id);
        toast.success("Test case deleted successfully");
      } catch (error) {
        toast.error("Failed to delete test case");
      }
    }
  };

  const handleRun = (testCaseId) => {
    const testCase = testCases.find(tc => tc.Id === testCaseId);
    setRunningTestCase(testCase);
    setRunModalOpen(true);
  };

  const handleRunResult = async (result) => {
    try {
      await runTestCase(runningTestCase.Id, result);
      toast.success(`Test marked as ${result}`);
      setRunModalOpen(false);
      setRunningTestCase(null);
    } catch (error) {
      toast.error("Failed to update test result");
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Search test cases..."
            className="sm:w-80"
          />
          
          <div className="flex gap-3">
            <FilterDropdown
              title="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              title="Priority"
              options={priorityOptions}
              value={priorityFilter}
              onChange={setPriorityFilter}
            />
          </div>
        </div>
        
        <Button
          onClick={handleCreate}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          New Test Case
        </Button>
      </div>

      {filteredTestCases.length === 0 ? (
        <Empty
          title="No test cases found"
          description={searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
            ? "Try adjusting your search or filters" 
            : "Create your first test case to get started"
          }
          actionText="Create Test Case"
          onAction={searchTerm || statusFilter !== "all" || priorityFilter !== "all" ? undefined : handleCreate}
          icon="FileText"
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredTestCases.map(testCase => (
              <TestCaseCard
                key={testCase.Id}
                testCase={testCase}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRun={handleRun}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <TestCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        testCase={editingTestCase}
        projects={projects}
      />

      <AnimatePresence>
        {runModalOpen && runningTestCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setRunModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mark Test Result
                </h3>
                <button
                  onClick={() => setRunModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
</div>
              
              <p className="text-gray-600 mb-6">
                How did the test "{runningTestCase.title_c}" perform?
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="success"
                  onClick={() => handleRunResult("pass")}
                  className="flex-1 inline-flex items-center justify-center gap-2"
                >
                  <ApperIcon name="CheckCircle" className="w-4 h-4" />
                  Pass
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleRunResult("fail")}
                  className="flex-1 inline-flex items-center justify-center gap-2"
                >
                  <ApperIcon name="XCircle" className="w-4 h-4" />
                  Fail
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRunResult("blocked")}
                  className="flex-1 inline-flex items-center justify-center gap-2"
                >
                  <ApperIcon name="AlertCircle" className="w-4 h-4" />
                  Blocked
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestCases;