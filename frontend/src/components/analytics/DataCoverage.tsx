import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface CoverageData {
  country: string;
  coverage: number;
  indicators: number;
  lastUpdate: string;
}

interface DataCoverageProps {
  data?: CoverageData[];
  title?: string;
}

const DataCoverage: React.FC<DataCoverageProps> = ({
  data = [],
  title = 'Data Coverage by Country'
}) => {
  // Mock data if none provided
  const mockData: CoverageData[] = [
    { country: 'SWE', coverage: 94.2, indicators: 4, lastUpdate: '2025-01-15' },
    { country: 'MEX', coverage: 87.8, indicators: 4, lastUpdate: '2025-01-15' },
    { country: 'NZL', coverage: 91.5, indicators: 4, lastUpdate: '2025-01-14' },
    { country: 'THA', coverage: 89.3, indicators: 4, lastUpdate: '2025-01-15' }
  ];

  const chartData = data.length > 0 ? data : mockData;
  const averageCoverage = chartData.reduce((sum, item) => sum + item.coverage, 0) / chartData.length;

  const getBarColor = (coverage: number) => {
    if (coverage >= 90) return '#10B981'; // green-500
    if (coverage >= 80) return '#29B8B0'; // stabilizer-cyan
    if (coverage >= 70) return '#F59E0B'; // yellow-500
    return '#EF4444'; // red-500
  };

  const getCoverageStatus = (coverage: number) => {
    if (coverage >= 90) return { variant: 'success' as const, label: 'Excellent' };
    if (coverage >= 80) return { variant: 'info' as const, label: 'Good' };
    if (coverage >= 70) return { variant: 'warning' as const, label: 'Fair' };
    return { variant: 'error' as const, label: 'Poor' };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-charcoal border border-quantum-ember/20 rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-medium">{`Country: ${label}`}</p>
          <p className="text-sm text-quantum-ember">{`Coverage: ${data.coverage.toFixed(1)}%`}</p>
          <p className="text-sm text-text-secondary">{`Indicators: ${data.indicators}`}</p>
          <p className="text-sm text-text-secondary">{`Last Update: ${new Date(data.lastUpdate).toLocaleDateString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card glow>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-mono uppercase text-text-primary tracking-wider">
          {title}
        </h3>
        <div className="flex items-center space-x-3">
          <Badge variant={getCoverageStatus(averageCoverage).variant}>
            {getCoverageStatus(averageCoverage).label}
          </Badge>
          <span className="text-text-primary font-mono text-lg">
            {averageCoverage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#7B29B8" opacity={0.2} />
            <XAxis 
              dataKey="country" 
              stroke="#FFFFFF" 
              fontSize={12}
            />
            <YAxis 
              stroke="#FFFFFF" 
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="coverage" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.coverage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">Best Coverage</p>
          <p className="text-text-primary font-mono text-lg">
            {Math.max(...chartData.map(d => d.coverage)).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">Lowest Coverage</p>
          <p className="text-text-primary font-mono text-lg">
            {Math.min(...chartData.map(d => d.coverage)).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-quantum-ember/20">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">Total Countries</span>
          <span className="text-text-primary font-mono">{chartData.length}</span>
        </div>
      </div>
    </Card>
  );
};

export default DataCoverage;