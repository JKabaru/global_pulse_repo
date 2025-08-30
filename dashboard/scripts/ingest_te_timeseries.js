const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config(); // Load .env from globalpulse root

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const teApiKey = process.env.TE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const countries = ['sweden', 'mexico', 'new zealand', 'thailand'];
const indicators = ['gdp', 'inflation cpi', 'unemployment rate', 'trade balance'];
const countryMap = {
  'sweden': 'SWE',
  'mexico': 'MEX',
  'new zealand': 'NZL',
  'thailand': 'THA'
};
const baseUrl = 'https://api.tradingeconomics.com';
const startDate = '2020-08-28'; // 5 years ago from 2025-08-28
const endDate = '2025-08-28';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    console.error(`Failed to log ingestion for ${endpoint}:`, error.message);
  }
}

async function ingestTimeSeries() {
  try {
    for (const country of countries) {
      for (const indicator of indicators) {
        const countryCode = countryMap[country];
        const startTime = new Date();
        const endpoint = `/historical/country/${country}/indicator/${indicator}/${startDate}/${endDate}?c=${teApiKey}&f=json`;

        try {
          const response = await axios.get(`${baseUrl}${endpoint}`);
          const records = response.data;

          if (!records || records.length === 0) {
            console.log(`No data for ${country} - ${indicator}`);
            await logIngestion(endpoint, 'success', 0, 'No data returned', startTime);
            await delay(1000);
            continue;
          }

          const insertData = records.map(record => ({
            country_code: countryCode,
            indicator_name: indicator,
            date_value: new Date(record.DateTime).toISOString().split('T')[0],
            value_raw: record.Value,
            unit_raw: record.Unit || null,
            source_url: record.SourceURL || null,
            release_date: record.ReleaseDate ? new Date(record.ReleaseDate).toISOString().split('T')[0] : null,
            vintage_date: record.VintageDate ? new Date(record.VintageDate).toISOString().split('T')[0] : null,
            ingested_at: new Date().toISOString(),
            content_hash: computeHash(record)
          }));

          const { error } = await supabase.from('raw_te_timeseries').insert(insertData);
          
          if (error) {
            console.error(`Failed to store ${country} - ${indicator} time series:`, error.message);
            await logIngestion(endpoint, 'failed', 0, error.message, startTime);
          } else {
            console.log(`Stored ${country} - ${indicator} time series (${insertData.length} records)`);
            await logIngestion(endpoint, 'success', insertData.length, null, startTime);
          }
        } catch (err) {
          if (err.response?.status === 429) {
            console.warn(`Rate limit hit for ${country} - ${indicator}. Retrying after 2 seconds...`);
            await delay(2000);
            // Retry once
            try {
              const response = await axios.get(`${baseUrl}${endpoint}`);
              const records = response.data;
              const insertData = records.map(record => ({
                country_code: countryCode,
                indicator_name: indicator,
                date_value: new Date(record.DateTime).toISOString().split('T')[0],
                value_raw: record.Value,
                unit_raw: record.Unit || null,
                source_url: record.SourceURL || null,
                release_date: record.ReleaseDate ? new Date(record.ReleaseDate).toISOString().split('T')[0] : null,
                vintage_date: record.VintageDate ? new Date(record.VintageDate).toISOString().split('T')[0] : null,
                ingested_at: new Date().toISOString(),
                content_hash: computeHash(record)
              }));

              const { error } = await supabase.from('raw_te_timeseries').insert(insertData);
              if (error) {
                console.error(`Retry failed for ${country} - ${indicator}:`, error.message);
                await logIngestion(endpoint, 'failed', 0, error.message, startTime);
              } else {
                console.log(`Stored ${country} - ${indicator} time series (${insertData.length} records)`);
                await logIngestion(endpoint, 'success', insertData.length, null, startTime);
              }
            } catch (retryErr) {
              console.error(`Retry failed for ${country} - ${indicator}:`, retryErr.message);
              await logIngestion(endpoint, 'failed', 0, retryErr.message, startTime);
            }
          } else {
            console.error(`Failed to fetch ${country} - ${indicator} time series:`, err.message);
            await logIngestion(endpoint, 'failed', 0, err.message, startTime);
          }
        }
        await delay(1000); // Respect 1 request/second rate limit
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

ingestTimeSeries();
