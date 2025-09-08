import { toast } from 'react-toastify';

const tableName = 'test_case_c';

export const testCaseService = {
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
          { field: { Name: "project_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "steps_c" } },
          { field: { Name: "expected_result_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "last_run_c" } },
          { field: { Name: "last_result_c" } }
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
        console.error("Error fetching test cases:", error?.response?.data?.message);
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
          { field: { Name: "project_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "steps_c" } },
          { field: { Name: "expected_result_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "last_run_c" } },
          { field: { Name: "last_result_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);

      if (!response || !response.data) {
        throw new Error("Test case not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching test case with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Test case not found");
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
          { field: { Name: "project_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "steps_c" } },
          { field: { Name: "expected_result_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "last_run_c" } },
          { field: { Name: "last_result_c" } }
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
        console.error("Error fetching test cases by project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(testCaseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: testCaseData.title || testCaseData.title_c,
            project_id_c: parseInt(testCaseData.projectId || testCaseData.project_id_c),
            title_c: testCaseData.title || testCaseData.title_c,
            description_c: testCaseData.description || testCaseData.description_c,
            steps_c: Array.isArray(testCaseData.steps) ? testCaseData.steps.join('\n') : testCaseData.steps_c,
            expected_result_c: testCaseData.expectedResult || testCaseData.expected_result_c,
            priority_c: testCaseData.priority || testCaseData.priority_c || "medium",
            status_c: testCaseData.status || testCaseData.status_c || "draft"
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
          console.error(`Failed to create test case ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating test case:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, testCaseData) {
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
            Name: testCaseData.title || testCaseData.title_c,
            project_id_c: parseInt(testCaseData.projectId || testCaseData.project_id_c),
            title_c: testCaseData.title || testCaseData.title_c,
            description_c: testCaseData.description || testCaseData.description_c,
            steps_c: Array.isArray(testCaseData.steps) ? testCaseData.steps.join('\n') : testCaseData.steps_c,
            expected_result_c: testCaseData.expectedResult || testCaseData.expected_result_c,
            priority_c: testCaseData.priority || testCaseData.priority_c,
            status_c: testCaseData.status || testCaseData.status_c
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
          console.error(`Failed to update test case ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating test case:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async updateResult(id, result) {
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
            last_run_c: new Date().toISOString(),
            last_result_c: result
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
          console.error(`Failed to update test case result ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating test case result:", error?.response?.data?.message);
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
          console.error(`Failed to delete test case ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting test case:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};