import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/navigation/Header';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import SystemStatus from '../components/dashboard/SystemStatus';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import DataQualityIndicator from '../components/dashboard/DataQualityIndicator';
import PerformanceMetrics from '../components/analytics/PerformanceMetrics';
import DataCoverage from '../components/analytics/DataCoverage';
import ForecastChart from '../components/charts/ForecastChart';
import CategoryDistributionChart from '../components/charts/CategoryDistributionChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useDashboardMetrics, useForecasts } from '../hooks/useData';
import type { ChartDataPoint, CategoryMetrics } from '../types';

const Dashboard: React.FC = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { forecasts, loading: forecastsLoading } = useForecasts();

  if (metricsLoading || forecastsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-text-secondary py-12">
        Failed to load dashboard metrics
      </div>
    );
  }

  // Transform forecast data for charts
  const chartData: ChartDataPoint[] = forecasts.slice(0, 10).map(forecast => ({
    date: forecast.forecast_date,
    value: forecast.forecast_value,
    forecast: forecast.forecast_value,
    confidence_lower: forecast.confidence_interval_lower || undefined,
    confidence_upper: forecast.confidence_interval_upper || undefined
  }));

  // Mock category data - in production this would come from taxonomy_mapping
  const categoryData: CategoryMetrics[] = [
    { category_id: 1, category_name: 'Growth', total_mappings: 12, coverage_percentage: 85.2, primary_mappings: 8 },
    { category_id: 2, category_name: 'Prices', total_mappings: 8, coverage_percentage: 92.1, primary_mappings: 6 },
    { category_id: 3, category_name: 'Labor', total_mappings: 6, coverage_percentage: 78.9, primary_mappings: 4 },
    { category_id: 4, category_name: 'Trade', total_mappings: 10, coverage_percentage: 88.7, primary_mappings: 7 },
    { category_id: 5, category_name: 'Sentiment', total_mappings: 4, coverage_percentage: 65.3, primary_mappings: 2 }
  ];

  return (
    <div className="space-y-6">
      <Header 
        title="Dashboard" 
        subtitle="Economic intelligence overview and system metrics"
      />

      <div className="p-6 space-y-8">
        {/* Metrics Grid */}
        <MetricsGrid metrics={metrics} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Charts Section */}
          <div className="xl:col-span-4 space-y-6">
            {/* Top Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-charcoal border border-quantum-ember/20 rounded-xl p-6">
                  <ForecastChart 
                    data={chartData}
                    title="Recent Forecast Trends"
                    showConfidenceInterval={true}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-charcoal border border-quantum-ember/20 rounded-xl p-6">
                  <CategoryDistributionChart 
                    data={categoryData}
                    title="Category Distribution"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <DataQualityIndicator overallScore={metrics.dataQuality} />
              </motion.div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <PerformanceMetrics />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <DataCoverage />
              </motion.div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SystemStatus 
                health={metrics.systemHealth}
                lastUpdate={metrics.lastUpdate}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <RecentActivity />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <QuickActions />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;