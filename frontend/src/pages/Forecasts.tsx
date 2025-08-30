import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';
import Header from '../components/navigation/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ForecastChart from '../components/charts/ForecastChart';
import { useForecasts } from '../hooks/useData';
import type { ChartDataPoint } from '../types';

const Forecasts: React.FC = () => {
  const { forecasts, loading, error } = useForecasts();
  const [selectedHorizon, setSelectedHorizon] = useState<string>('3M');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

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
        Error loading forecasts: {error}
      </div>
    );
  }

  const filteredForecasts = forecasts.filter(forecast => {
    const matchesHorizon = selectedHorizon === 'all' || forecast.forecast_horizon === selectedHorizon;
    const matchesCountry = selectedCountry === 'all' || forecast.country_code === selectedCountry;
    return matchesHorizon && matchesCountry;
  });

  const chartData: ChartDataPoint[] = filteredForecasts.slice(0, 20).map(forecast => ({
    date: forecast.forecast_date,
    value: forecast.forecast_value,
    forecast: forecast.forecast_value,
    confidence_lower: forecast.confidence_interval_lower || undefined,
    confidence_upper: forecast.confidence_interval_upper || undefined
  }));

  const countries = Array.from(new Set(forecasts.map(f => f.country_code)));
  const horizons = ['1M', '3M', '6M'];

  return (
    <div className="space-y-6">
      <Header 
        title="Forecasts" 
        subtitle="Economic predictions and trend analysis across countries and indicators"
      />

      <div className="p-6 space-y-6">
        {/* Controls */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Forecast Horizon
                </label>
                <select
                  value={selectedHorizon}
                  onChange={(e) => setSelectedHorizon(e.target.value)}
                  className="px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
                >
                  <option value="all">All Horizons</option>
                  {horizons.map(horizon => (
                    <option key={horizon} value={horizon}>{horizon}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
                >
                  <option value="all">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button variant="primary" icon={<ChartBarIcon className="w-4 h-4" />}>
              Generate New Forecast
            </Button>
          </div>
        </Card>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-charcoal border border-quantum-ember/20 rounded-xl p-6">
            <ForecastChart 
              data={chartData}
              title="Forecast Trends"
              showConfidenceInterval={true}
            />
          </div>
        </motion.div>

        {/* Forecast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForecasts.slice(0, 9).map((forecast, index) => (
            <motion.div
              key={forecast.forecast_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-radiant-magenta/10 rounded-lg">
                      {forecast.forecast_value > 0 ? (
                        <TrendingUpIcon className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDownIcon className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-text-primary font-medium">
                        {forecast.country_name || forecast.country_code}
                      </h4>
                      <p className="text-text-secondary text-sm">
                        {forecast.indicator_name}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" size="sm">
                    {forecast.forecast_horizon}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Forecast Value</span>
                    <span className={`font-mono font-bold ${
                      forecast.forecast_value > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {forecast.forecast_value.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Model</span>
                    <span className="text-text-primary text-sm">{forecast.model_name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Date</span>
                    <span className="text-text-primary text-sm">
                      {new Date(forecast.forecast_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {forecast.confidence_interval_lower && forecast.confidence_interval_upper && (
                  <div className="mt-4 pt-4 border-t border-quantum-ember/20">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary">Confidence Interval</span>
                      <span className="text-text-primary">
                        [{forecast.confidence_interval_lower.toFixed(2)}, {forecast.confidence_interval_upper.toFixed(2)}]
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredForecasts.length === 0 && (
          <div className="text-center py-12">
            <ChartBarIcon className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No forecasts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecasts;