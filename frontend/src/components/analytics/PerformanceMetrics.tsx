import React from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CpuChipIcon,
  ServerIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface PerformanceMetric {
  name: string;
  value: string;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  icon: React.ComponentType<any>;
  description: string;
}

const PerformanceMetrics: React.FC = () => {
  const metrics: PerformanceMetric[] = [
    {
      name: 'API Response Time',
      value: '127ms',
      status: 'excellent',
      icon: ClockIcon,
      description: 'Average response time for API calls'
    },
    {
      name: 'Data Processing',
      value: '2.3s',
      status: 'good',
      icon: CpuChipIcon,
      description: 'Time to process new data batches'
    },
    {
      name: 'System Uptime',
      value: '99.97%',
      status: 'excellent',
      icon: ServerIcon,
      description: 'System availability over last 30 days'
    },
    {
      name: 'Forecast Latency',
      value: '4.1s',
      status: 'good',
      icon: SignalIcon,
      description: 'Time to generate new forecasts'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-stabilizer-cyan';
      case 'warning': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'excellent': return 'success' as const;
      case 'good': return 'info' as const;
      case 'warning': return 'warning' as const;
      case 'poor': return 'error' as const;
      default: return 'default' as const;
    }
  };

  return (
    <Card glow>
      <h3 className="text-lg font-mono uppercase text-text-primary mb-6 tracking-wider">
        Performance Metrics
      </h3>

      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-deep-void/30 rounded-lg hover:bg-deep-void/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-quantum-ember/10 rounded-lg">
                  <Icon className="w-5 h-5 text-quantum-ember" />
                </div>
                <div>
                  <p className="text-text-primary font-medium">{metric.name}</p>
                  <p className="text-text-secondary text-xs">{metric.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-mono font-bold text-lg ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </p>
                <Badge variant={getStatusVariant(metric.status)} size="sm">
                  {metric.status}
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-quantum-ember/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wide">Avg Response</p>
            <p className="text-text-primary font-mono text-lg">156ms</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wide">Peak Load</p>
            <p className="text-text-primary font-mono text-lg">847 req/min</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceMetrics;