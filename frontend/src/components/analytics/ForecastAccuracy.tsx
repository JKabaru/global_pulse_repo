import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface AccuracyData {
  date: string;
  accuracy: number;
  model: string;
  country: string;
}

interface ForecastAccuracyProps {
  data?: AccuracyData[];
  title?: string;
}

const ForecastAccuracy: React.FC<ForecastAccuracyProps> = ({
  data = [],
  title = 'Forecast Accuracy Over Time'
}) => {
  // Mock data if none provided
  const mockData: AccuracyData[] = [
    { date: '2024-01', accuracy: 87.2, model: 'ARIMA', country: 'SWE' },
    { date: '2024-02', accuracy: 89.1, model: 'ARIMA', country: 'SWE' },
    { date: '2024-03', accuracy: 91.5, model: 'ARIMA', country: 'SWE' },
    { date: '2024-04', accuracy: 88.7, model: 'ARIMA', country: 'SWE' },
    { date: '2024-05', accuracy: 92.3, model: 'ARIMA', country: 'SWE' },
    { date: '2024-06', accuracy: 90.8, model: 'ARIMA', country: 'SWE' },
    { date: '2024-07', accuracy: 93.1, model: 'ARIMA', country: 'SWE' },
    { date: '2024-08', accuracy: 91.9, model: 'ARIMA', country: 'SWE' }
  ];

  const chartData = data.length > 0 ? data : mockData;
  const averageAccuracy = chartData.reduce((sum, item) => sum + item.accuracy, 0) / chartData.length;
  
  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy >= 90) return { variant: 'success' as const, label: 'Excellent' };
    if (accuracy >= 80) return { variant: 'info' as const, label: 'Good' };
    if (accuracy >= 70) return { variant: 'warning' as const, label: 'Fair' };
    return { variant: 'error' as const, label: 'Poor' };
  };

  const status = getAccuracyStatus(averageAccuracy);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-charcoal border border-quantum-ember/20 rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-medium">{`Date: ${label}`}</p>
          <p className="text-sm text-quantum-ember">{`Accuracy: ${data.accuracy.toFixed(1)}%`}</p>
          <p className="text-sm text-text-secondary">{`Model: ${data.model}`}</p>
          <p className="text-sm text-text-secondary">{`Country: ${data.country}`}</p>
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
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
          <span className="text-text-primary font-mono text-lg">
            {averageAccuracy.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#7B29B8" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="#FFFFFF" 
              fontSize={12}
            />
            <YAxis 
              stroke="#FFFFFF" 
              fontSize={12}
              domain={[60, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={80} stroke="#C129A0" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#7B29B8"
              strokeWidth={3}
              dot={{ fill: '#7B29B8', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#7B29B8', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">Best</p>
          <p className="text-text-primary font-mono text-lg">
            {Math.max(...chartData.map(d => d.accuracy)).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">Average</p>
          <p className="text-text-primary font-mono text-lg">
            {averageAccuracy.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">Worst</p>
          <p className="text-text-primary font-mono text-lg">
            {Math.min(...chartData.map(d => d.accuracy)).toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ForecastAccuracy;