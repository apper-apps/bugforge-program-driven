import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import BugCard from "@/components/organisms/BugCard";
import BugModal from "@/components/organisms/BugModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import useBugs from "@/hooks/useBugs";
import useProjects from "@/hooks/useProjects";
import ApperIcon from "@/components/ApperIcon";

const Bugs = () => {
  const { bugs, loading, error, createBug, updateBug, updateBugStatus, deleteBug, refetch } = useBugs();
  const { projects } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBug, setEditingBug] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "new", label: "New" },
    { value: "assigned", label: "Assigned" },
    { value: "in-progress", label: "In Progress" },
    { value: "testing", label: "Testing" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" }
  ];

  const severityOptions = [
    { value: "all", label: "All Severities" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

const filteredBugs = bugs.filter(bug => {
    const matchesSearch = (bug.title_c || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bug.description_c || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bug.status_c === statusFilter;
    const matchesSeverity = severityFilter === "all" || bug.severity_c === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleCreate = () => {
    setEditingBug(null);
    setIsModalOpen(true);
  };

  const handleEdit = (bug) => {
    setEditingBug(bug);
    setIsModalOpen(true);
  };

  const handleSave = async (bugData) => {
    if (editingBug) {
      await updateBug(editingBug.Id, bugData);
    } else {
      await createBug(bugData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bug report?")) {
      try {
        await deleteBug(id);
        toast.success("Bug deleted successfully");
      } catch (error) {
        toast.error("Failed to delete bug");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateBugStatus(id, status);
      toast.success(`Bug status updated to ${status.replace("-", " ")}`);
    } catch (error) {
      toast.error("Failed to update bug status");
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
            placeholder="Search bugs..."
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
              title="Severity"
              options={severityOptions}
              value={severityFilter}
              onChange={setSeverityFilter}
            />
          </div>
        </div>
        
        <Button
          onClick={handleCreate}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          Report Bug
        </Button>
      </div>

      {filteredBugs.length === 0 ? (
        <Empty
          title="No bugs found"
          description={searchTerm || statusFilter !== "all" || severityFilter !== "all" 
            ? "Try adjusting your search or filters" 
            : "Report your first bug to get started"
          }
          actionText="Report Bug"
          onAction={searchTerm || statusFilter !== "all" || severityFilter !== "all" ? undefined : handleCreate}
          icon="Bug"
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredBugs.map(bug => (
              <BugCard
                key={bug.Id}
                bug={bug}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <BugModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        bug={editingBug}
        projects={projects}
      />
    </div>
  );
};

export default Bugs;