import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import type { CategoryMetrics } from '../../types';

interface CategoryDistributionChartProps {
  data: CategoryMetrics[];
  title?: string;
}

const COLORS = ['#7B29B8', '#C129A0', '#29B8B0', '#FF6B6B', '#4ECDC4'];

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  data,
  title
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-charcoal border border-quantum-ember/20 rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-medium">{data.category_name}</p>
          <p className="text-sm text-text-secondary">{`Mappings: ${data.total_mappings}`}</p>
          <p className="text-sm text-text-secondary">{`Coverage: ${data.coverage_percentage.toFixed(1)}%`}</p>
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category_name, coverage_percentage }) => 
              `${category_name} (${coverage_percentage.toFixed(1)}%)`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="total_mappings"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#FFFFFF' }}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryDistributionChart;