import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ProjectModal from "@/components/organisms/ProjectModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import useProjects from "@/hooks/useProjects";
import useBugs from "@/hooks/useBugs";
import useTestCases from "@/hooks/useTestCases";
import ApperIcon from "@/components/ApperIcon";

const Projects = () => {
  const { projects, loading, error, createProject, updateProject, deleteProject, refetch } = useProjects();
  const { bugs } = useBugs();
  const { testCases } = useTestCases();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

const filteredProjects = projects.filter(project =>
    (project.name_c || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description_c || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProjectStats = (projectId) => {
const projectBugs = bugs.filter(b => b.project_id_c === parseInt(projectId));
    const projectTestCases = testCases.filter(tc => tc.project_id_c === parseInt(projectId));
    const openBugs = projectBugs.filter(b => !["resolved", "closed"].includes(b.status_c)).length;
    
    return {
      totalBugs: projectBugs.length,
      openBugs,
      totalTestCases: projectTestCases.length
    };
  };

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSave = async (projectData) => {
    if (editingProject) {
      await updateProject(editingProject.Id, projectData);
    } else {
      await createProject(projectData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project? This will also affect related test cases and bugs.")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted successfully");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
          placeholder="Search projects..."
          className="sm:w-80"
        />
        
        <Button
          onClick={handleCreate}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <Empty
          title="No projects found"
          description={searchTerm 
            ? "Try adjusting your search terms" 
            : "Create your first project to organize your test cases and bugs"
          }
          actionText="Create Project"
          onAction={searchTerm ? undefined : handleCreate}
          icon="FolderOpen"
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredProjects.map(project => {
              const stats = getProjectStats(project.Id);
              return (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card hover className="p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
{project.name_c || project.Name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {project.description_c}
                        </p>
                      </div>
                      <Badge 
                        variant={project.status_c === "active" ? "success" : "default"}
                        className="ml-2"
                      >
                        {project.status_c}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Bug" className="w-4 h-4 text-error" />
                          <span className="text-gray-600">Bugs:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {stats.totalBugs}
                          </span>
                          {stats.openBugs > 0 && (
                            <Badge variant="error" className="text-xs">
                              {stats.openBugs} open
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="FileText" className="w-4 h-4 text-primary" />
                          <span className="text-gray-600">Test Cases:</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {stats.totalTestCases}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
<span className="text-gray-900">
                          {format(new Date(project.created_at_c || project.CreatedOn), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
                          className="inline-flex items-center gap-2"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.Id)}
                          className="text-error hover:bg-error/10 inline-flex items-center gap-2"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        project={editingProject}
      />
    </div>
  );
};

export default Projects;