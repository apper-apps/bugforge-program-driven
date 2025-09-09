import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";

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
            user_id_c: notificationData.user_id_c,
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
      throw error;
    }
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

// Notification Bell Component
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    if (user?.userId) {
      loadNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.userId]);

  const loadNotifications = async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      const data = await notificationService.getByUserId(user.userId);
      setNotifications(data || []);
      const unread = data?.filter(n => !n.is_read_c).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      loadNotifications();
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAsUnread = async (notificationId) => {
    try {
      await notificationService.markAsUnread(notificationId);
      loadNotifications();
      toast.success("Notification marked as unread");
    } catch (error) {
      toast.error("Failed to mark notification as unread");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      >
        <ApperIcon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">{unreadCount} unread</p>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <ApperIcon name="Loader2" className="animate-spin mx-auto mb-2" size={20} />
                <p className="text-sm text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center">
                <ApperIcon name="Bell" className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.Id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.is_read_c ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.Name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp_c && new Date(notification.timestamp_c).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {notification.is_read_c ? (
                        <button
                          onClick={() => handleMarkAsUnread(notification.Id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Mark as unread"
                        >
                          <ApperIcon name="Mail" size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsRead(notification.Id)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Mark as read"
                        >
                          <ApperIcon name="MailOpen" size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setShowDropdown(false)}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { notificationService, NotificationBell };