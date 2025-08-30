import React from 'react';
import { motion } from 'framer-motion';
import {
  GlobeAltIcon,
  ChartBarIcon,
  TrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { DashboardMetrics } from '../../types';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Countries',
      value: metrics.totalCountries,
      icon: GlobeAltIcon,
      color: 'text-stabilizer-cyan',
      bgColor: 'bg-stabilizer-cyan/10',
      change: '+2.3%'
    },
    {
      title: 'Indicators',
      value: metrics.totalIndicators,
      icon: ChartBarIcon,
      color: 'text-quantum-ember',
      bgColor: 'bg-quantum-ember/10',
      change: '+5.1%'
    },
    {
      title: 'Forecasts',
      value: metrics.totalForecasts,
      icon: TrendingUpIcon,
      color: 'text-radiant-magenta',
      bgColor: 'bg-radiant-magenta/10',
      change: '+12.4%'
    },
    {
      title: 'Data Quality',
      value: `${metrics.dataQuality}%`,
      icon: ClockIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+0.8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card glow>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium uppercase tracking-wide">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-mono font-bold text-text-primary mt-1">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <Badge variant="success" size="sm">
                      {metric.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;