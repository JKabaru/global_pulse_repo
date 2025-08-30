const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapping for normalizing indicator names
const indicatorNameMap = {
  'gdp': 'GDP',
  'consumer price index cpi': 'Consumer Price Index CPI',
  'unemployment rate': 'Unemployment Rate',
  'balance of trade': 'Balance of Trade'
};

async function computeHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

async function logIngestion(endpoint, status, recordsProcessed, errorMessage, startTime) {
  const endTime = new Date();
  const executionTimeMs = endTime - startTime;
  const { error } = await supabase.from('ingestion_log').insert({
    endpoint,
    status,
    records_processed: recordsProcessed,
    error_message: errorMessage || null,
    started_at: startTime.toISOString(),
    completed_at: endTime.toISOString(),
    execution_time_ms: executionTimeMs
  });
  if (error) {
    console.error(`Failed to log transformation for ${endpoint}:`, error.message);
  }
}

async function transformToCanonical() {
  try {
    // Step 1: Transform countries
    const startTimeCountries = new Date();
    const { data: rawCountries, error: countryError } = await supabase
      .from('raw_te_metadata')
      .select('country_code, response_data')
      .eq('endpoint_type', 'countries');

    if (countryError) {
      console.error('Failed to fetch raw countries:', countryError.message);
      await logIngestion('transform_countries', 'failed', 0, countryError.message, startTimeCountries);
      return;
    }

    const countryData = rawCountries.map(country => ({
      country_code: country.country_code,
      country_name: country.response_data[0]?.CountryName || country.country_code,
      region: country.response_data[0]?.Continent || null
    }));

    const { error: insertCountryError } = await supabase
      .from('canonical_countries')
      .upsert(countryData, { onConflict: 'country_code' });

    if (insertCountryError) {
      console.error('Failed to store canonical countries:', insertCountryError.message);
      await logIngestion('transform_countries', 'failed', 0, insertCountryError.message, startTimeCountries);
      return;
    }
    console.log(`Stored ${countryData.length} canonical countries`);
    await logIngestion('transform_countries', 'success', countryData.length, null, startTimeCountries);

    // Step 2: Transform indicators
    const startTimeIndicators = new Date();
    const { data: rawIndicators, error: indicatorError } = await supabase
      .from('raw_te_metadata')
      .select('response_data')
      .eq('endpoint_type', 'indicators')
      .limit(1);

    if (indicatorError) {
      console.error('Failed to fetch raw indicators:', indicatorError.message);
      await logIngestion('transform_indicators', 'failed', 0, indicatorError.message, startTimeIndicators);
      return;
    }

    console.log('Query result:', rawIndicators);
    console.log('Indicator categories:', rawIndicators[0]?.response_data.map(item => item.Category) || []);

    if (rawIndicators.length === 0) {
      console.error('No raw indicator data found.');
      await logIngestion('transform_indicators', 'failed', 0, 'No raw indicator data found.', startTimeIndicators);
      return;
    }

    const indicatorData = rawIndicators[0].response_data.map(indicator => {
      const normalizedName = Object.keys(indicatorNameMap).find(
        key => key.toLowerCase() === indicator.Category.toLowerCase()
      ) || indicator.Category;
      return {
        indicator_name: normalizedName,
        description: indicator.Description || null,
        unit: indicator.Unit || null
      };
    });

    const { error: insertIndicatorError } = await supabase
      .from('canonical_indicators')
      .upsert(indicatorData, { onConflict: 'indicator_name' });

    if (insertIndicatorError) {
      console.error('Failed to store canonical indicators:', insertIndicatorError.message);
      await logIngestion('transform_indicators', 'failed', 0, insertIndicatorError.message, startTimeIndicators);
      return;
    }
    console.log(`Stored ${indicatorData.length} canonical indicators`);
    await logIngestion('transform_indicators', 'success', indicatorData.length, null, startTimeIndicators);

    // Step 3: Transform time series
    const startTimeTimeseries = new Date();
    const { data: rawTimeseries, error: timeseriesError } = await supabase
      .from('raw_te_timeseries')
      .select('*');

    if (timeseriesError) {
      console.error('Failed to fetch raw time series:', timeseriesError.message);
      await logIngestion('transform_timeseries', 'failed', 0, timeseriesError.message, startTimeTimeseries);
      return;
    }

    const { data: indicators, error: fetchIndicatorError } = await supabase
      .from('canonical_indicators')
      .select('indicator_id, indicator_name');

    if (fetchIndicatorError) {
      console.error('Failed to fetch canonical indicators:', fetchIndicatorError.message);
      await logIngestion('transform_timeseries', 'failed', 0, fetchIndicatorError.message, startTimeTimeseries);
      return;
    }

    console.log('Canonical indicators:', indicators.map(ind => ind.indicator_name));

    const indicatorMap = new Map(indicators.map(ind => [ind.indicator_name.toLowerCase(), ind.indicator_id]));

    const timeseriesData = rawTimeseries
      .filter(ts => indicatorMap.has(ts.indicator_name.toLowerCase()))
      .map(ts => ({
        country_code: ts.country_code,
        indicator_id: indicatorMap.get(ts.indicator_name.toLowerCase()),
        date_value: ts.date_value,
        value: ts.value_raw,
        unit: ts.unit_raw,
        source_url: ts.source_url,
        release_date: ts.release_date,
        vintage_date: ts.vintage_date,
        ingested_at: new Date().toISOString(),
        content_hash: ts.content_hash
      }));

    console.log('Time series records to insert:', timeseriesData.length);

    const { error: insertTimeseriesError } = await supabase
      .from('canonical_timeseries')
      .upsert(timeseriesData, { onConflict: ['country_code', 'indicator_id', 'date_value', 'vintage_date'] });

    if (insertTimeseriesError) {
      console.error('Failed to store canonical time series:', insertTimeseriesError.message);
      await logIngestion('transform_timeseries', 'failed', 0, insertTimeseriesError.message, startTimeTimeseries);
      return;
    }
    console.log(`Stored ${timeseriesData.length} canonical time series records`);
    await logIngestion('transform_timeseries', 'success', timeseriesData.length, null, startTimeTimeseries);
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

transformToCanonical();