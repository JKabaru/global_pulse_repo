const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const teApiKey = process.env.TE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const indicators = ['GDP', 'Consumer Price Index CPI', 'Unemployment Rate', 'Balance of Trade'];

const baseUrl = 'https://api.tradingeconomics.com';

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

async function ingestIndicators() {
  const startTime = new Date();
  const endpoint = `/indicators?c=${teApiKey}&f=json`;
  try {
    const response = await axios.get(`${baseUrl}${endpoint}`);
    console.log('API response categories:', response.data.map(item => item.Category));
    const contentHash = await computeHash(response.data);
    
    const filteredData = response.data.filter(item => 
      indicators.some(ind => ind.toLowerCase() === item.Category.toLowerCase())
    );
    
    if (filteredData.length === 0) {
      console.error('No matching indicators found in API response.');
      await logIngestion(endpoint, 'failed', 0, 'No matching indicators found.', startTime);
      return;
    }

    const { error } = await supabase.from('raw_te_metadata').insert({
      endpoint_type: 'indicators',
      response_data: filteredData,
      fetched_at: new Date().toISOString(),
      api_status_code: response.status,
      content_hash: contentHash
    });
    
    if (error) {
      console.error('Failed to store indicators metadata:', error.message);
      await logIngestion(endpoint, 'failed', 0, error.message, startTime);
    } else {
      console.log(`Stored indicators metadata (${filteredData.length} records)`);
      await logIngestion(endpoint, 'success', filteredData.length, null, startTime);
    }
  } catch (err) {
    console.error('Failed to fetch indicators metadata:', err.message);
    await logIngestion(endpoint, 'failed', 0, err.message, startTime);
  }
}

ingestIndicators();