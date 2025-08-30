import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import Header from '../components/navigation/Header';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import IndicatorForm from '../components/forms/IndicatorForm';
import { useIndicators } from '../hooks/useData';

const Indicators: React.FC = () => {
  const { indicators, loading, error } = useIndicators();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<any>(null);

  const handleAddIndicator = () => {
    setEditingIndicator(null);
    setShowForm(true);
  };

  const handleEditIndicator = (indicator: any) => {
    setEditingIndicator(indicator);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    // In a real app, you'd refresh the data here
    console.log('Indicator saved successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        Error loading indicators: {error}
      </div>
    );
  }

  const filteredIndicators = indicators.filter(indicator =>
    indicator.indicator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (indicator.description && indicator.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDownIcon className="w-4 h-4 text-red-400" />;
      default: return <MinusIcon className="w-4 h-4 text-text-secondary" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Indicators" 
        subtitle="Economic indicators and their performance metrics"
      />

      <div className="p-6 space-y-6">
        {/* Search */}
        <Card>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search indicators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<DocumentChartBarIcon className="w-4 h-4" />}
              />
            </div>
            <Button 
              variant="primary" 
              icon={<DocumentChartBarIcon className="w-4 h-4" />}
              onClick={handleAddIndicator}
            >
              Add Indicator
            </Button>
          </div>
        </Card>

        {/* Indicators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.indicator_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover glow>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-stabilizer-cyan/10 rounded-lg">
                      <DocumentChartBarIcon className="w-6 h-6 text-stabilizer-cyan" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {indicator.indicator_name}
                      </h3>
                      {indicator.description && (
                        <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                          {indicator.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(indicator.trend)}
                    <Badge 
                      variant={indicator.trend === 'up' ? 'success' : indicator.trend === 'down' ? 'error' : 'default'}
                      size="sm"
                    >
                      {indicator.trend}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wide">Data Points</p>
                    <p className="text-text-primary font-mono text-lg">{indicator.dataPoints}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wide">Coverage</p>
                    <p className="text-text-primary font-mono text-lg">{indicator.coverage.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wide">Last Value</p>
                    <p className={`font-mono text-lg ${getTrendColor(indicator.trend)}`}>
                      {indicator.lastValue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wide">Unit</p>
                    <p className="text-text-primary text-sm">{indicator.unit || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-quantum-ember/20">
                  <span className="text-text-secondary text-xs">
                    Updated {new Date(indicator.updated_at).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditIndicator(indicator)}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-charcoal border border-quantum-ember/20 rounded-xl p-6">
              <ForecastChart 
                data={chartData}
                title="Indicator Forecast Overview"
                showConfidenceInterval={true}
              />
            </div>
          </motion.div>
        )}

        {filteredIndicators.length === 0 && (
          <div className="text-center py-12">
            <DocumentChartBarIcon className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No indicators found matching your search</p>
          </div>
        )}
      </div>

      <IndicatorForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        editData={editingIndicator}
      />
    </div>
  );
};

export default Indicators;