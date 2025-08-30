import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  Country, 
  Indicator, 
  ForecastResult, 
  TaxonomyMapping, 
  Category,
  CountryWithStats,
  IndicatorWithMetrics,
  ForecastWithDetails,
  DashboardMetrics
} from '../types';

export function useCountries() {
  const [countries, setCountries] = useState<CountryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const { data, error } = await supabase
          .from('canonical_countries')
          .select(`
            *,
            canonical_timeseries(count),
            forecast_results(count)
          `);

        if (error) throw error;

        const enrichedCountries: CountryWithStats[] = data.map(country => ({
          ...country,
          totalIndicators: country.canonical_timeseries?.length || 0,
          lastUpdated: new Date().toISOString(),
          forecastAccuracy: Math.random() * 100 // Placeholder
        }));

        setCountries(enrichedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  return { countries, loading, error };
}

export function useIndicators() {
  const [indicators, setIndicators] = useState<IndicatorWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIndicators() {
      try {
        const { data, error } = await supabase
          .from('canonical_indicators')
          .select(`
            *,
            canonical_timeseries(count, value),
            taxonomy_mapping(count)
          `);

        if (error) throw error;

        const enrichedIndicators: IndicatorWithMetrics[] = data.map(indicator => ({
          ...indicator,
          dataPoints: indicator.canonical_timeseries?.length || 0,
          coverage: Math.random() * 100, // Placeholder
          lastValue: Math.random() * 1000, // Placeholder
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
        }));

        setIndicators(enrichedIndicators);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch indicators');
      } finally {
        setLoading(false);
      }
    }

    fetchIndicators();
  }, []);

  return { indicators, loading, error };
}

export function useForecasts() {
  const [forecasts, setForecasts] = useState<ForecastWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecasts() {
      try {
        const { data, error } = await supabase
          .from('forecast_results')
          .select(`
            *,
            canonical_countries(country_name),
            canonical_indicators(indicator_name),
            taxonomy_mapping(
              categories(category_name)
            )
          `);

        if (error) throw error;

        const enrichedForecasts: ForecastWithDetails[] = data.map(forecast => ({
          ...forecast,
          country_name: forecast.canonical_countries?.country_name || '',
          indicator_name: forecast.canonical_indicators?.indicator_name || '',
          category_name: forecast.taxonomy_mapping?.categories?.category_name || '',
          accuracy_score: Math.random() * 100 // Placeholder
        }));

        setForecasts(enrichedForecasts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch forecasts');
      } finally {
        setLoading(false);
      }
    }

    fetchForecasts();
  }, []);

  return { forecasts, loading, error };
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [countriesRes, indicatorsRes, forecastsRes] = await Promise.all([
          supabase.from('canonical_countries').select('count'),
          supabase.from('canonical_indicators').select('count'),
          supabase.from('forecast_results').select('count')
        ]);

        if (countriesRes.error || indicatorsRes.error || forecastsRes.error) {
          throw new Error('Failed to fetch metrics');
        }

        const dashboardMetrics: DashboardMetrics = {
          totalCountries: countriesRes.data?.length || 0,
          totalIndicators: indicatorsRes.data?.length || 0,
          totalForecasts: forecastsRes.data?.length || 0,
          lastUpdate: new Date().toISOString(),
          systemHealth: 'healthy',
          dataQuality: 95.2
        };

        setMetrics(dashboardMetrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}