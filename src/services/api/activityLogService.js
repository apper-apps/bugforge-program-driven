import { toast } from "react-toastify";
import React from "react";

const tableName = 'activity_log_c';

const activityLogService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {
            field: {
              Name: "Id"
            }
          },
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "user_id_c"
            }
          },
          {
            field: {
              Name: "timestamp_c"
            }
          },
          {
            field: {
              Name: "action_type_c"
            }
          },
          {
            field: {
              Name: "details_c"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activity logs:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getByUserId(userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {
            field: {
              Name: "Id"
            }
          },
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "user_id_c"
            }
          },
          {
            field: {
              Name: "timestamp_c"
            }
          },
          {
            field: {
              Name: "action_type_c"
            }
          },
          {
            field: {
              Name: "details_c"
            }
          }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user activity logs:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
},

  // Validate action type against allowed picklist values
  validateActionType(actionType) {
    const validActions = ['assigned to bug', 'assigned to test case', 'mentioned in comment'];
    return validActions.includes(actionType) ? actionType : 'mentioned in comment';
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: `${activityData.action_type_c} - ${new Date().toISOString()}`,
user_id_c: parseInt(activityData.user_id_c),
            timestamp_c: activityData.timestamp_c || new Date().toISOString(),
            action_type_c: this.validateActionType(activityData.action_type_c),
            details_c: activityData.details_c
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create activity log ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating activity log:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
};

export { activityLogService };