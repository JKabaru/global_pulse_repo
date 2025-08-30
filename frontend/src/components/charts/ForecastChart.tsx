import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface ForecastChartProps {
  data: ChartDataPoint[];
  title?: string;
  showConfidenceInterval?: boolean;
}

const ForecastChart: React.FC<ForecastChartProps> = ({
  data,
  title,
  showConfidenceInterval = true
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-charcoal border border-quantum-ember/20 rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-medium">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value?.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      {title && (
        <h3 className="text-lg font-mono uppercase text-text-primary mb-4 tracking-wider">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#7B29B8" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            stroke="#FFFFFF" 
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis stroke="#FFFFFF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          
          {showConfidenceInterval && (
            <Area
              dataKey="confidence_upper"
              stroke="none"
              fill="#7B29B8"
              fillOpacity={0.1}
            />
          )}
          
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7B29B8"
            strokeWidth={2}
            dot={{ fill: '#7B29B8', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#7B29B8', strokeWidth: 2, fill: '#FFFFFF' }}
          />
          
          {data.some(d => d.forecast) && (
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#C129A0"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#C129A0', strokeWidth: 2, r: 4 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;