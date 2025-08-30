import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface SystemStatusProps {
  health: 'healthy' | 'warning' | 'error';
  lastUpdate: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ health, lastUpdate }) => {
  const statusConfig = {
    healthy: {
      icon: CheckCircleIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      badge: 'success' as const,
      message: 'All systems operational'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      badge: 'warning' as const,
      message: 'Minor issues detected'
    },
    error: {
      icon: XCircleIcon,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      badge: 'error' as const,
      message: 'System errors present'
    }
  };

  const config = statusConfig[health];
  const Icon = config.icon;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-mono uppercase text-text-primary tracking-wider">
          System Status
        </h3>
        <Badge variant={config.badge}>
          {health.toUpperCase()}
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`p-3 rounded-lg ${config.bgColor}`}
        >
          <Icon className={`w-8 h-8 ${config.color}`} />
        </motion.div>
        
        <div>
          <p className="text-text-primary font-medium">{config.message}</p>
          <p className="text-text-secondary text-sm">
            Last updated: {new Date(lastUpdate).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary text-sm">Data Pipeline</span>
          <Badge variant="success">Active</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary text-sm">Forecast Engine</span>
          <Badge variant="success">Running</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary text-sm">API Gateway</span>
          <Badge variant="success">Online</Badge>
        </div>
      </div>
    </Card>
  );
};

export default SystemStatus;