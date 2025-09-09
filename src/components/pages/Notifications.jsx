import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { notificationService } from '@/services/api/notificationService';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';

const Notifications = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.userId) return;
      
      setLoading(true);
      try {
        const userNotifications = await notificationService.getByUserId(user.userId);
        setNotifications(userNotifications || []);
        setError('');
      } catch (err) {
        setError('Failed to load notifications');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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
      
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read_c);
    
    for (const notification of unreadNotifications) {
      try {
        await notificationService.markAsRead(notification.Id);
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }
    
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, is_read_c: true }))
    );
    
    toast.success('All notifications marked as read');
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;

  const unreadCount = notifications.filter(n => !n.is_read_c).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="CheckCheck" className="w-4 h-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Empty
          title="No notifications"
          description="You're all caught up! New notifications will appear here."
          icon="Bell"
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-colors ${
                    !notification.is_read_c ? 'bg-primary/5 border-primary/20' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => !notification.is_read_c && markAsRead(notification.Id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.is_read_c ? 'bg-primary' : 'bg-gray-300'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        !notification.is_read_c 
                          ? 'font-semibold text-gray-900' 
                          : 'text-gray-700'
                      }`}>
                        {notification.Name || 'New notification'}
                      </p>
                      
                      {notification.timestamp_c && (
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(notification.timestamp_c), 'MMM d, yyyy h:mm a')}
                        </p>
                      )}
                    </div>
                    
                    {!notification.is_read_c && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.Id);
                        }}
                        className="text-primary hover:text-primary-dark"
                      >
                        <ApperIcon name="Check" className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Notifications;