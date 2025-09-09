import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { teamMemberService } from "@/services/api/teamMemberService";
import { projectService } from "@/services/api/projectService";

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    user_id_c: "",
    project_id_c: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch available users - in production this would come from authentication system
      const fetchUsers = async () => {
        // Placeholder for user fetching - would typically use ApperClient to get system users
        // This would integrate with the authentication system's user management
        return [
          { Id: 1, Name: "John Doe" },
          { Id: 2, Name: "Jane Smith" },
          { Id: 3, Name: "Mike Johnson" },
          { Id: 4, Name: "Sarah Wilson" }
        ];
      };
      
      const [membersData, projectsData, usersData] = await Promise.all([
        teamMemberService.getAll(),
        projectService.getAll(),
        fetchUsers()
      ]);
      
      setTeamMembers(membersData || []);
      setProjects(projectsData || []);
      setUsers(usersData || []);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Name.trim() || !formData.user_id_c || !formData.project_id_c) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      if (editingMember) {
        await teamMemberService.update(editingMember.Id, {
          Name: formData.Name,
          user_id_c: formData.user_id_c,
          project_id_c: parseInt(formData.project_id_c)
        });
        toast.success("Team member updated successfully");
      } else {
        await teamMemberService.create({
          Name: formData.Name,
          user_id_c: formData.user_id_c,
          project_id_c: parseInt(formData.project_id_c)
        });
        toast.success("Team member added successfully");
      }
      
      resetForm();
      loadData();
    } catch (error) {
      toast.error(`Failed to ${editingMember ? 'update' : 'add'} team member`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
Name: member.Name || "",
      user_id_c: member.user_id_c?.Id || member.user_id_c || "",
      project_id_c: member.project_id_c?.Id || member.project_id_c || ""
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    
    try {
      setLoading(true);
      await teamMemberService.delete([id]);
      toast.success("Team member removed successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to remove team member");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: "",
      user_id_c: "",
      project_id_c: ""
    });
    setEditingMember(null);
    setShowAddModal(false);
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      (member.Name && member.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.user_id_c?.Name && member.user_id_c.Name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProject = !selectedProject || 
      (member.project_id_c?.Id && member.project_id_c.Id.toString() === selectedProject);
    
    return matchesSearch && matchesProject;
  });

  if (loading && teamMembers.length === 0) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage project team members and collaborators</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <ApperIcon name="UserPlus" size={16} />
          Add Team Member
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.Id} value={project.Id}>
                  {project.Name || project.name_c}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Team Members List */}
      {filteredMembers.length === 0 ? (
        <Empty 
          message="No team members found" 
          description="Add team members to start collaborating on projects"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <motion.div
              key={member.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {member.Name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      User: {member.user_id_c?.Name || member.user_id_c || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Project: {member.project_id_c?.Name || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <ApperIcon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.Id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  value={formData.Name}
                  onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                  placeholder="Team member name"
                  required
                />
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User
                </label>
                <Select
                  value={formData.user_id_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_id_c: e.target.value }))}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.Id} value={user.Id}>
                      {user.Name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <Select
                  value={formData.project_id_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_id_c: e.target.value }))}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.Id} value={project.Id}>
                      {project.Name || project.name_c}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingMember ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;