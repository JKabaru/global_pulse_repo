import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  onSort,
  sortKey,
  sortDirection,
  className
}) => {
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  if (loading) {
    return (
      <div className="bg-charcoal border border-quantum-ember/20 rounded-xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-quantum-ember/20 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-quantum-ember/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-charcoal border border-quantum-ember/20 rounded-xl overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-quantum-ember/20 bg-deep-void/30">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'text-left py-4 px-6 text-text-secondary text-sm uppercase tracking-wide font-medium',
                    column.sortable && 'cursor-pointer hover:text-text-primary transition-colors'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && sortKey === column.key && (
                      <span className="text-quantum-ember">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-quantum-ember/10 hover:bg-deep-void/30 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-6 text-text-primary">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          No data available
        </div>
      )}
    </div>
  );
};

export default Table;