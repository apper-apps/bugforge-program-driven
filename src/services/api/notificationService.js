const tableName = 'notification_c';

const notificationService = {
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
              Name: "comment_id_c"
            }
          },
          {
            field: {
              Name: "timestamp_c"
            }
          },
          {
            field: {
              Name: "is_read_c"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
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
        console.error("Error fetching notifications:", error?.response?.data?.message);
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
              Name: "comment_id_c"
            }
          },
          {
            field: {
              Name: "timestamp_c"
            }
          },
          {
            field: {
              Name: "is_read_c"
            }
          }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [userId]
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

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user notifications:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(notificationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        records: [
          {
            Name: notificationData.Name,
            user_id_c: parseInt(notificationData.user_id_c),
            comment_id_c: parseInt(notificationData.comment_id_c),
            timestamp_c: notificationData.timestamp_c,
            is_read_c: notificationData.is_read_c
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
          console.error(`Failed to create notification ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating notification:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async createForMention(userId, commentId, mentionedBy) {
    return await this.create({
      Name: `You were mentioned in a comment by ${mentionedBy}`,
      user_id_c: userId,
      comment_id_c: commentId,
      timestamp_c: new Date().toISOString(),
      is_read_c: false
    });
  },

  async createForAssignment(userId, itemType, itemTitle, assignedBy) {
    return await this.create({
      Name: `You were assigned to ${itemType}: ${itemTitle} by ${assignedBy}`,
      user_id_c: userId,
      comment_id_c: null,
      timestamp_c: new Date().toISOString(),
      is_read_c: false
});
  },

  async markAsRead(id) {
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
            is_read_c: true
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return response.results && response.results.some(result => result.success);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking notification as read:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  },

  async markAsUnread(id) {
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
            is_read_c: false
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return response.results && response.results.some(result => result.success);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking notification as unread:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  },

  async delete(ids) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: Array.isArray(ids) ? ids.map(id => parseInt(id)) : [parseInt(ids)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const expectedDeletions = Array.isArray(ids) ? ids.length : 1;
        return successfulDeletions.length === expectedDeletions;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting notification:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};

export { notificationService };