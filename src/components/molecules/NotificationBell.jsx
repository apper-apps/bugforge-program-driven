import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { notificationService } from '@/services/api/notificationService';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const NotificationBell = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.userId) return;
      
      setLoading(true);
      try {
const userNotifications = await notificationService.getByUserId(user.userId);
        setNotifications(userNotifications || []);
        setUnreadCount(userNotifications?.filter(n => !n.is_read_c).length || 0);
        setError(null);
      } catch (err) {
        setError('Failed to load notifications');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user?.userId]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.Id === notificationId 
            ? { ...notification, is_read_c: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`relative p-2 rounded-lg transition-colors ${
          unreadCount > 0 
            ? 'bg-primary/10 text-primary hover:bg-primary/20' 
            : 'bg-surface hover:bg-gray-100 text-gray-600'
        }`}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <ApperIcon name="Bell" size={20} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{unreadCount} unread</p>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <ApperIcon name="Loader2" size={20} className="animate-spin mx-auto text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-sm text-error">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center">
                <ApperIcon name="Bell" size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.Id}
                    onClick={() => !notification.is_read_c && markAsRead(notification.Id)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.is_read_c ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        !notification.is_read_c ? 'bg-primary' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          !notification.is_read_c 
                            ? 'font-semibold text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.Name || 'New notification'}
                        </p>
                        {notification.timestamp_c && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {format(new Date(notification.timestamp_c), 'MMM d, yyyy h:mm a')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;