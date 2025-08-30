import React, { useState, useEffect } from 'react';
import { fetchForecastResults, fetchTaxonomyMappings } from '../lib/fetchData';
import type { Database } from '../lib/database.types'; // Ensure this path is correct
import DashboardLayout from '../layouts/DashboardLayout';
import DataTable from './DataTable';
import ChartCard from './ChartCard';

// Define specific types for your data using the generated Database type
type Forecast = Database['public']['Tables']['forecast_results']['Row'];
type Mapping = Database['public']['Tables']['taxonomy_mapping']['Row'];

const Dashboard: React.FC = () => {
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [taxonomyData, setTaxonomyData] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('Sweden');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [forecasts, mappings] = await Promise.all([
          fetchForecastResults(),
          fetchTaxonomyMappings(),
        ]);
        setForecastData(forecasts || []);
        setTaxonomyData(mappings || []);
      } catch (err) {
        console.error('Data loading error:', err);
        setError('Failed to load data. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  const filteredForecasts = forecastData.filter(item => item.country_code === selectedCountry);
  const chartLabels = filteredForecasts.map(item => new Date(item.forecast_date).toLocaleDateString());
  const chartData = filteredForecasts.map(item => item.forecast_value || 0);

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-roboto uppercase mb-6 text-[#7B29B8]">GlobalPulse Admin Dashboard</h1>
        <div className="mb-6">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="p-2 border border-gray-300 rounded text-black"
          >
            <option value="Sweden">Sweden</option>
            <option value="Mexico">Mexico</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Thailand">Thailand</option>
          </select>
        </div>
        <ChartCard title="Forecast Trends" data={chartData} labels={chartLabels} />
        <DataTable columns={['Country', 'Forecast Value', 'Date']} data={filteredForecasts.map(item => ({
          Country: item.country_code,
          'Forecast Value': `${item.forecast_value}%`,
          Date: new Date(item.forecast_date).toLocaleDateString(),
        }))} />
        <DataTable columns={['Country', 'Category', 'Primary']} data={taxonomyData.map(item => ({
          Country: item.country_code,
          Category: item.category_id,
          Primary: item.is_primary ? 'Yes' : 'No',
        }))} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;