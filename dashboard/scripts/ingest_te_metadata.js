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

async function ingestMetadata() {
  try {
    // 1. Fetch and ingest country metadata (using ISO codes)
    for (const country of countries) {
      const countryCode = countryMap[country];
      const startTime = new Date();
      const endpoint = `/country/${country}?c=${teApiKey}&f=json`;

      try {
        const response = await axios.get(`${baseUrl}${endpoint}`);
        const contentHash = await computeHash(response.data);
        
        const { error } = await supabase.from('raw_te_metadata').insert({
          endpoint_type: 'countries',
          country_code: countryCode,
          response_data: response.data,
          fetched_at: new Date().toISOString(),
          api_status_code: response.status,
          content_hash: contentHash
        });
        
        if (error) {
          console.error(`Failed to store ${country} metadata:`, error.message);
        } else {
          console.log(`Stored ${country} metadata`);
        }
        await logIngestion(endpoint, error ? 'failed' : 'success', error ? 0 : 1, error ? error.message : null, startTime);
      } catch (err) {
        console.error(`Failed to fetch ${country} metadata:`, err.message);
        await logIngestion(endpoint, 'failed', 0, err.message, startTime);
      }
      await delay(1000); // Respect 1 request/second rate limit
    }

    // 2. Fetch all indicators metadata once, then insert filtered data
    const startTimeIndicators = new Date();
    const indicatorEndpoint = `/indicators?c=${teApiKey}&f=json`;
    try {
      const response = await axios.get(`${baseUrl}${indicatorEndpoint}`);
      const contentHash = await computeHash(response.data);
      
      const filteredData = response.data.filter(item => indicators.includes(item.Category.toLowerCase()));
      
      const { error } = await supabase.from('raw_te_metadata').insert({
        endpoint_type: 'indicators',
        response_data: filteredData,
        fetched_at: new Date().toISOString(),
        api_status_code: response.status,
        content_hash: contentHash
      });
      
      if (error) {
        console.error(`Failed to store indicators metadata:`, error.message);
        await logIngestion(indicatorEndpoint, 'failed', 0, error.message, startTimeIndicators);
      } else {
        console.log(`Stored indicators metadata`);
        await logIngestion(indicatorEndpoint, 'success', filteredData.length, null, startTimeIndicators);
      }
    } catch (err) {
      console.error(`Failed to fetch indicators metadata:`, err.message);
      await logIngestion(indicatorEndpoint, 'failed', 0, err.message, startTimeIndicators);
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

ingestMetadata();