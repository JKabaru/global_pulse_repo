import { describe, it, expect } from 'vitest';
import { fetchForecastResults, fetchTaxonomyMappings } from '../lib/fetchData';

describe('fetchData', () => {
  it('fetches forecast results successfully', async () => {
    let forecastData;
    let fetchError: any = null;

    try {
      forecastData = await fetchForecastResults();
    } catch (e) {
      fetchError = e;
    }

    // Assert that no error was thrown
    expect(fetchError).toBeNull();
    
    // Assert that data is not null
    expect(forecastData).not.toBeNull();

    if (forecastData) {
      // 👇 LOG THE COUNT
      console.log(`- Fetched ${forecastData.length} forecast results.`);
      expect(Array.isArray(forecastData)).toBe(true);
    }
  });

  it('fetches taxonomy mappings successfully', async () => {
    let taxonomyData;
    let fetchError: any = null;

    try {
      taxonomyData = await fetchTaxonomyMappings();
    } catch (e) {
      fetchError = e;
    }
    
    // Assert that no error was thrown
    expect(fetchError).toBeNull();

    // Assert that data is not null
    expect(taxonomyData).not.toBeNull();
    
    if (taxonomyData) {
      // 👇 LOG THE COUNT
      console.log(`- Fetched ${taxonomyData.length} taxonomy mappings.`);
      expect(Array.isArray(taxonomyData)).toBe(true);
    }
  });
});