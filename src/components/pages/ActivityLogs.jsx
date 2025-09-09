import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { activityLogService } from '@/services/api/activityLogService';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import FilterDropdown from '@/components/molecules/FilterDropdown';

const ActivityLogs = () => {
  const { user } = useSelector((state) => state.user);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'assigned to bug', label: 'Bug Assignments' },
    { value: 'assigned to test case', label: 'Test Case Assignments' },
    { value: 'mentioned in comment', label: 'Mentions' }
  ];

  useEffect(() => {
    const fetchActivityLogs = async () => {
      setLoading(true);
      try {
        const logs = filter === 'all' || !user?.userId 
          ? await activityLogService.getAll()
          : await activityLogService.getByUserId(user.userId);
        
        setActivityLogs(logs || []);
        setError('');
      } catch (err) {
        setError('Failed to load activity logs');
        console.error('Error fetching activity logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, [user?.userId, filter]);

  const getActivityIcon = (actionType) => {
    switch (actionType) {
      case 'assigned to bug':
        return 'Bug';
      case 'assigned to test case':
        return 'CheckCircle';
      case 'mentioned in comment':
        return 'MessageCircle';
      case 'Bug Created':
        return 'Plus';
      case 'Test Case Created':
        return 'FileText';
      case 'Status Changed':
        return 'GitBranch';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (actionType) => {
    switch (actionType) {
      case 'assigned to bug':
        return 'text-red-600 bg-red-100';
      case 'assigned to test case':
        return 'text-green-600 bg-green-100';
      case 'mentioned in comment':
        return 'text-blue-600 bg-blue-100';
      case 'Bug Created':
        return 'text-orange-600 bg-orange-100';
      case 'Test Case Created':
        return 'text-purple-600 bg-purple-100';
      case 'Status Changed':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredLogs = activityLogs.filter(log => 
    filter === 'all' || log.action_type_c === filter
  );

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-1">
            Complete audit trail of all system activities and user actions
          </p>
        </div>
        
        <FilterDropdown
          title="Activity Type"
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {filteredLogs.length === 0 ? (
        <Empty
          title="No activity logs"
          description={filter !== 'all' 
            ? "No activities found for the selected filter" 
            : "No activities recorded yet"
          }
          icon="Activity"
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredLogs.map((log) => (
              <motion.div
                key={log.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full flex-shrink-0 ${getActivityColor(log.action_type_c)}`}>
                      <ApperIcon 
                        name={getActivityIcon(log.action_type_c)} 
                        className="w-4 h-4" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {log.action_type_c?.replace(/([a-z])([A-Z])/g, '$1 $2') || 'Activity'}
                        </h3>
                        {log.timestamp_c && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {format(new Date(log.timestamp_c), 'MMM d, yyyy h:mm a')}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {log.details_c || 'No additional details'}
                      </p>
                    </div>
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

export default ActivityLogs;