import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface QualityMetric {
  name: string;
  value: number;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  description: string;
}

interface DataQualityIndicatorProps {
  overallScore: number;
}

const DataQualityIndicator: React.FC<DataQualityIndicatorProps> = ({ overallScore }) => {
  const metrics: QualityMetric[] = [
    {
      name: 'Completeness',
      value: 94.2,
      status: 'excellent',
      description: 'Percentage of expected data points present'
    },
    {
      name: 'Accuracy',
      value: 97.8,
      status: 'excellent',
      description: 'Data validation success rate'
    },
    {
      name: 'Timeliness',
      value: 89.1,
      status: 'good',
      description: 'Data freshness and update frequency'
    },
    {
      name: 'Consistency',
      value: 92.5,
      status: 'excellent',
      description: 'Cross-source data alignment'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircleIcon;
      case 'good': return InformationCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'poor': return XCircleIcon;
      default: return InformationCircleIcon;
    }
  };

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

  const getOverallStatus = (score: number) => {
    if (score >= 95) return 'excellent';
    if (score >= 85) return 'good';
    if (score >= 70) return 'warning';
    return 'poor';
  };

  const overallStatus = getOverallStatus(overallScore);
  const OverallIcon = getStatusIcon(overallStatus);

  return (
    <Card glow>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-mono uppercase text-text-primary tracking-wider">
          Data Quality
        </h3>
        <Badge variant={getStatusVariant(overallStatus)}>
          {overallStatus.toUpperCase()}
        </Badge>
      </div>

      {/* Overall Score */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-quantum-ember/20"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallScore / 100)}`}
              className={getStatusColor(overallStatus)}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - overallScore / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-mono font-bold text-text-primary">
              {overallScore.toFixed(0)}%
            </span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <OverallIcon className={`w-5 h-5 ${getStatusColor(overallStatus)}`} />
            <span className="text-text-primary font-medium">Overall Quality Score</span>
          </div>
          <p className="text-text-secondary text-sm">
            Based on {metrics.length} quality dimensions
          </p>
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = getStatusIcon(metric.status);
          
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-deep-void/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${getStatusColor(metric.status)}`} />
                <div>
                  <p className="text-text-primary font-medium">{metric.name}</p>
                  <p className="text-text-secondary text-xs">{metric.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-mono font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-quantum-ember/20">
        <button className="text-quantum-ember text-sm font-medium hover:text-quantum-ember/80 transition-colors">
          View detailed quality report →
        </button>
      </div>
    </Card>
  );
};

export default DataQualityIndicator;