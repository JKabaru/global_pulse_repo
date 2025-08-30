import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowPathIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  CogIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const QuickActions: React.FC = () => {
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});

  const handleAction = async (actionId: string, action: () => void) => {
    setLoadingStates(prev => ({ ...prev, [actionId]: true }));
    try {
      await action();
    } finally {
      setLoadingStates(prev => ({ ...prev, [actionId]: false }));
    }
  };

  const actions: QuickAction[] = [
    {
      id: 'refresh-data',
      title: 'Refresh Data',
      description: 'Update all economic indicators',
      icon: ArrowPathIcon,
      action: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Data refreshed');
      },
      variant: 'primary'
    },
    {
      id: 'generate-forecasts',
      title: 'Generate Forecasts',
      description: 'Run forecast models for all countries',
      icon: ChartBarIcon,
      action: async () => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Forecasts generated');
      },
      variant: 'secondary'
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download current dataset',
      icon: DocumentArrowDownIcon,
      action: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Data exported');
      },
      variant: 'secondary'
    },
    {
      id: 'system-maintenance',
      title: 'System Maintenance',
      description: 'Run system cleanup and optimization',
      icon: CogIcon,
      action: async () => {
        await new Promise(resolve => setTimeout(resolve, 4000));
        console.log('Maintenance completed');
      },
      variant: 'secondary'
    }
  ];

  return (
    <Card>
      <h3 className="text-lg font-mono uppercase text-text-primary mb-6 tracking-wider">
        Quick Actions
      </h3>

      <div className="space-y-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isLoading = loadingStates[action.id];

          return (
            <motion.div
              key={action.id}
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
                  <h4 className="text-text-primary font-medium">{action.title}</h4>
                  <p className="text-text-secondary text-sm">{action.description}</p>
                </div>
              </div>

              <Button
                variant={action.variant || 'secondary'}
                size="sm"
                loading={isLoading}
                onClick={() => handleAction(action.id, action.action)}
                icon={isLoading ? undefined : <PlayIcon className="w-4 h-4" />}
              >
                {isLoading ? 'Running...' : 'Run'}
              </Button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-quantum-ember/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Last system update</span>
          <span className="text-text-primary font-mono">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default QuickActions;