import { toast } from 'react-toastify';

const tableName = 'bug_c';

export const bugService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "severity_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "reporter_c" } },
          { field: { Name: "reproduction_steps_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching bugs:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "severity_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "reporter_c" } },
          { field: { Name: "reproduction_steps_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);

      if (!response || !response.data) {
        throw new Error("Bug not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching bug with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Bug not found");
    }
  },

  async getByProject(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "severity_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "reporter_c" } },
          { field: { Name: "reproduction_steps_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)],
            Include: true
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching bugs by project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

async create(bugData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: bugData.title || bugData.title_c,
            project_id_c: parseInt(bugData.projectId || bugData.project_id_c),
            title_c: bugData.title || bugData.title_c,
            description_c: bugData.description || bugData.description_c,
            severity_c: bugData.severity || bugData.severity_c || "medium",
            priority_c: bugData.priority || bugData.priority_c || "medium",
            status_c: bugData.status || bugData.status_c || "new",
            assignee_c: bugData.assignee || bugData.assignee_c || "",
            reporter_c: bugData.reporter || bugData.reporter_c,
            reproduction_steps_c: Array.isArray(bugData.reproductionSteps) ? bugData.reproductionSteps.join('\n') : bugData.reproduction_steps_c,
            attachments_c: Array.isArray(bugData.attachments) ? bugData.attachments.join('\n') : bugData.attachments_c || "",
            created_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create bug ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        const createdBug = successfulRecords.length > 0 ? successfulRecords[0].data : null;
        
        // Log activity for bug creation
        if (createdBug) {
          await this.logActivity(bugData.reporter || 'Unknown', 'Bug Created', `Created bug: ${bugData.title}`);
          
          // Create notification for assignee if assigned
          if (bugData.assignee) {
            await this.createAssignmentNotification(bugData.assignee, createdBug.Id, bugData.title, bugData.reporter);
          }
        }

        return createdBug;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating bug:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

async update(id, bugData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: bugData.title || bugData.title_c,
            project_id_c: parseInt(bugData.projectId || bugData.project_id_c),
            title_c: bugData.title || bugData.title_c,
            description_c: bugData.description || bugData.description_c,
            severity_c: bugData.severity || bugData.severity_c,
            priority_c: bugData.priority || bugData.priority_c,
            status_c: bugData.status || bugData.status_c,
            assignee_c: bugData.assignee || bugData.assignee_c,
            reporter_c: bugData.reporter || bugData.reporter_c,
            reproduction_steps_c: Array.isArray(bugData.reproductionSteps) ? bugData.reproductionSteps.join('\n') : bugData.reproduction_steps_c,
            attachments_c: Array.isArray(bugData.attachments) ? bugData.attachments.join('\n') : bugData.attachments_c,
            updated_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update bug ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        const updatedBug = successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
        
        // Log activity for bug update
        if (updatedBug) {
          await this.logActivity(bugData.reporter || 'Unknown', 'Bug Updated', `Updated bug: ${bugData.title}`);
        }

        return updatedBug;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating bug:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

async updateStatus(id, status) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: parseInt(id),
            status_c: status,
            updated_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update bug status ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        const updatedBug = successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
        
        // Log activity for status change
        if (updatedBug) {
          await this.logActivity('System', 'Status Changed', `Bug status changed to: ${status}`);
        }

        return updatedBug;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating bug status:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete bug ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        const success = successfulDeletions.length > 0;
        
        // Log activity for bug deletion
        if (success) {
          await this.logActivity('System', 'Bug Deleted', `Bug with ID: ${id} was deleted`);
        }

        return success;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting bug:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async logActivity(userId, actionType, details) {
    try {
      const { activityLogService } = await import('./activityLogService');
      await activityLogService.create({
        user_id_c: userId,
        action_type_c: actionType,
        details_c: details,
        timestamp_c: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  },

  async createAssignmentNotification(assigneeId, bugId, bugTitle, assignedBy) {
    try {
      const { notificationService } = await import('./notificationService');
      await notificationService.createForAssignment(
        assigneeId,
        'bug',
        bugTitle,
        assignedBy || 'System'
      );
    } catch (error) {
      console.error('Failed to create assignment notification:', error);
    }
  }
};