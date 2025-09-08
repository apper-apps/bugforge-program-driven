import { useState, useEffect } from "react";
import { projectService } from "@/services/api/projectService";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    const newProject = await projectService.create(projectData);
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = async (id, projectData) => {
    const updatedProject = await projectService.update(id, projectData);
    setProjects(prev => prev.map(p => 
      p.Id === parseInt(id) ? updatedProject : p
    ));
    return updatedProject;
  };

  const deleteProject = async (id) => {
    await projectService.delete(id);
    setProjects(prev => prev.filter(p => p.Id !== parseInt(id)));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: loadProjects
  };
};

export default useProjects;