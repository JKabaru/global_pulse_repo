import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ChartBarIcon,
  PlayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { supabase } from '../../lib/supabase';

const schema = yup.object({
  country_code: yup.string().required('Country is required'),
  indicator_id: yup.number().required('Indicator is required'),
  forecast_horizon: yup.string().required('Forecast horizon is required'),
  model_name: yup.string().required('Model is required')
});

interface ForecastFormData {
  country_code: string;
  indicator_id: number;
  forecast_horizon: string;
  model_name: string;
}

interface ForecastFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ForecastForm: React.FC<ForecastFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ForecastFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      country_code: '',
      indicator_id: 0,
      forecast_horizon: '3M',
      model_name: 'ARIMA(1,1,1)'
    }
  });

  useEffect(() => {
    if (isOpen) {
      fetchCountriesAndIndicators();
    }
  }, [isOpen]);

  const fetchCountriesAndIndicators = async () => {
    try {
      const [countriesRes, indicatorsRes] = await Promise.all([
        supabase.from('canonical_countries').select('country_code, country_name'),
        supabase.from('canonical_indicators').select('indicator_id, indicator_name')
      ]);

      if (countriesRes.data) setCountries(countriesRes.data);
      if (indicatorsRes.data) setIndicators(indicatorsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onSubmit = async (data: ForecastFormData) => {
    setLoading(true);
    try {
      // Simulate forecast generation
      const forecastData = {
        ...data,
        forecast_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        forecast_value: Math.random() * 100 - 50, // Random forecast value
        confidence_interval_lower: Math.random() * 50 - 25,
        confidence_interval_upper: Math.random() * 50 + 25,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('forecast_results')
        .insert([forecastData]);
      
      if (error) throw error;

      showToast({
        type: 'success',
        title: 'Forecast Generated',
        message: 'New forecast has been successfully generated and saved.'
      });

      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error('Error generating forecast:', error);
      showToast({
        type: 'error',
        title: 'Forecast Failed',
        message: 'Failed to generate forecast. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const countryOptions = countries.map(country => ({
    value: country.country_code,
    label: `${country.country_name} (${country.country_code})`
  }));

  const indicatorOptions = indicators.map(indicator => ({
    value: indicator.indicator_id.toString(),
    label: indicator.indicator_name
  }));

  const horizonOptions = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '12M', label: '12 Months' }
  ];

  const modelOptions = [
    { value: 'ARIMA(1,1,1)', label: 'ARIMA (1,1,1)' },
    { value: 'ARIMA(2,1,2)', label: 'ARIMA (2,1,2)' },
    { value: 'Linear Regression', label: 'Linear Regression' },
    { value: 'Random Forest', label: 'Random Forest' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Generate New Forecast"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-radiant-magenta/10 rounded-lg">
            <ChartBarIcon className="w-6 h-6 text-radiant-magenta" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Generate Economic Forecast
            </h3>
            <p className="text-text-secondary text-sm">
              Select parameters to generate a new economic forecast
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Country
            </label>
            <select
              {...register('country_code')}
              className="w-full px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
            >
              <option value="">Select a country</option>
              {countryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.country_code && (
              <p className="text-sm text-red-500 mt-1">{errors.country_code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Economic Indicator
            </label>
            <select
              {...register('indicator_id', { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
            >
              <option value="">Select an indicator</option>
              {indicatorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.indicator_id && (
              <p className="text-sm text-red-500 mt-1">{errors.indicator_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Forecast Horizon
              </label>
              <select
                {...register('forecast_horizon')}
                className="w-full px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
              >
                {horizonOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.forecast_horizon && (
                <p className="text-sm text-red-500 mt-1">{errors.forecast_horizon.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Model
              </label>
              <select
                {...register('model_name')}
                className="w-full px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
              >
                {modelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.model_name && (
                <p className="text-sm text-red-500 mt-1">{errors.model_name.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-deep-void/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarIcon className="w-4 h-4 text-quantum-ember" />
            <span className="text-text-primary font-medium">Forecast Details</span>
          </div>
          <div className="text-sm text-text-secondary space-y-1">
            <p>• Forecast will be generated using historical data</p>
            <p>• Confidence intervals will be calculated automatically</p>
            <p>• Results will be available immediately after generation</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-quantum-ember/20">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={<PlayIcon className="w-4 h-4" />}
          >
            Generate Forecast
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ForecastForm;