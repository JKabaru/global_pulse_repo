import React, { useState, useEffect } from 'react';
import { fetchForecastResults, fetchTaxonomyMappings } from '../lib/fetchData';
import type { Database } from '../lib/database.types';
import { Grid, Paper, Typography, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Chart from 'chart.js/auto';

// Define specific types for your data using the generated Database type
type Forecast = Database['public']['Tables']['forecast_results']['Row'];
type Mapping = Database['public']['Tables']['taxonomy_mapping']['Row'];

const DashboardContent: React.FC = () => {
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

  useEffect(() => {
    if (forecastData.length > 0) {
      const ctx = document.getElementById('forecastChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: forecastData.map(item => new Date(item.forecast_date).toLocaleDateString()),
          datasets: [{
            label: 'Forecast Value (%)',
            data: forecastData.map(item => item.forecast_value),
            borderColor: '#7B29B8',
            fill: false,
          }],
        },
      });
    }
  }, [forecastData]);

  if (loading) return <Typography>Loading dashboard...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const filteredForecasts = forecastData.filter(item => item.country_code === selectedCountry);

  return (
    <div style={{ marginLeft: '240px', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Overview
      </Typography>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6">Global Economic Sentiment: {forecastData.length > 0 ? `${forecastData[0].forecast_value}%` : 'N/A'}</Typography>
        <Select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value as string)}
          style={{ marginTop: '10px' }}
        >
          <MenuItem value="Sweden">Sweden</MenuItem>
          <MenuItem value="Mexico">Mexico</MenuItem>
          <MenuItem value="New Zealand">New Zealand</MenuItem>
          <MenuItem value="Thailand">Thailand</MenuItem>
        </Select>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Forecast Trends</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredForecasts.map((item) => (
                  <TableRow key={item.forecast_id}>
                    <TableCell>{item.country_code}</TableCell>
                    <TableCell>{item.forecast_value}%</TableCell>
                    <TableCell>{new Date(item.forecast_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Category Mappings</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Primary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxonomyData.map((item) => (
                  <TableRow key={`${item.country_code}-${item.category_id}`}>
                    <TableCell>{item.country_code}</TableCell>
                    <TableCell>{item.category_id}</TableCell>
                    <TableCell>{item.is_primary ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Forecast Chart</Typography>
            <canvas id="forecastChart" style={{ width: '100%', height: '300px' }}></canvas>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardContent;