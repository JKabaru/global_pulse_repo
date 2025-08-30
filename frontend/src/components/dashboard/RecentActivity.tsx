import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ActivityItem {
  id: string;
  type: 'forecast' | 'ingestion' | 'validation' | 'error';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const RecentActivity: React.FC = () => {
  // Mock data - in production this would come from the ingestion_log table
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'forecast',
      message: 'Generated forecasts for Sweden GDP',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'success'
    },
    {
      id: '2',
      type: 'ingestion',
      message: 'Ingested Thailand unemployment data',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'success'
    },
    {
      id: '3',
      type: 'validation',
      message: 'Data validation completed',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'warning'
    },
    {
      id: '4',
      type: 'error',
      message: 'API rate limit exceeded for Mexico CPI',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'error'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'forecast': return ArrowTrendingUpIcon;
      case 'ingestion': return ArrowPathIcon;
      case 'validation': return CheckCircleIcon;
      case 'error': return ExclamationTriangleIcon;
      default: return CheckCircleIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-mono uppercase text-text-primary mb-6 tracking-wider">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type);
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-deep-void/30 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-charcoal ${getStatusColor(activity.status)}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm font-medium">
                  {activity.message}
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>

              <Badge 
                variant={activity.status === 'success' ? 'success' : activity.status === 'warning' ? 'warning' : 'error'}
                size="sm"
              >
                {activity.status}
              </Badge>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-quantum-ember/20">
        <button className="text-quantum-ember text-sm font-medium hover:text-quantum-ember/80 transition-colors">
          View all activity →
        </button>
      </div>
    </Card>
  );
};

export default RecentActivity;