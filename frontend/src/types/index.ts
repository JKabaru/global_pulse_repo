import type { Database } from '../lib/database.types';

// Core data types
export type Country = Database['public']['Tables']['canonical_countries']['Row'];
export type Indicator = Database['public']['Tables']['canonical_indicators']['Row'];
export type TimeseriesData = Database['public']['Tables']['canonical_timeseries']['Row'];
export type ForecastResult = Database['public']['Tables']['forecast_results']['Row'];
export type TaxonomyMapping = Database['public']['Tables']['taxonomy_mapping']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];

// Enhanced types for UI
export interface CountryWithStats extends Country {
  totalIndicators: number;
  lastUpdated: string;
  forecastAccuracy: number;
}

export interface IndicatorWithMetrics extends Indicator {
  dataPoints: number;
  coverage: number;
  lastValue: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ForecastWithDetails extends ForecastResult {
  country_name: string;
  indicator_name: string;
  category_name: string;
  accuracy_score: number;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
  forecast?: number;
  confidence_lower?: number;
  confidence_upper?: number;
}

export interface CategoryMetrics {
  category_id: number;
  category_name: string;
  total_mappings: number;
  coverage_percentage: number;
  primary_mappings: number;
}

// Filter and search types
export interface FilterState {
  countries: string[];
  indicators: string[];
  categories: string[];
  dateRange: {
    start: string;
    end: string;
  };
  forecastHorizons: string[];
}

export interface SearchState {
  query: string;
  filters: FilterState;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Navigation and UI state
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface DashboardMetrics {
  totalCountries: number;
  totalIndicators: number;
  totalForecasts: number;
  lastUpdate: string;
  systemHealth: 'healthy' | 'warning' | 'error';
  dataQuality: number;
}