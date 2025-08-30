const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function logValidation(tableName, validationRule, validationType, isValid, errorMessage, recordCount, startTime) {
  const endTime = new Date();
  const executionTimeMs = endTime - startTime;
  const { error } = await supabase.from('validation_log').insert({
    table_name: tableName,
    validation_rule: validationRule,
    validation_type: validationType,
    is_valid: isValid,
    error_message: errorMessage || null,
    record_count: recordCount,
    validated_at: startTime.toISOString(),
    execution_time_ms: executionTimeMs
  });
  if (error) {
    console.error(`Failed to log validation for ${tableName} - ${validationRule}:`, error.message);
  }
}

async function updateIngestionLog(endpoint, status, recordsProcessed, errorMessage, startTime) {
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

async function validateData() {
  const startTime = new Date();
  const endpoint = 'validate_data';
  let totalRecords = 0;
  try {
    // Clear previous validation logs
    const { error: clearError } = await supabase.from('validation_log').delete().neq('log_id', 0);
    if (clearError) {
      console.error('Failed to clear validation_log:', clearError.message);
      await updateIngestionLog(endpoint, 'failed', 0, clearError.message, startTime);
      return;
    }

    // Validate canonical_countries
    const { data: countryValidations, error: countryError } = await supabase
      .rpc('validate_canonical_countries');
    if (countryError) {
      console.error('Country validation failed:', countryError.message);
      await updateIngestionLog(endpoint, 'failed', 0, countryError.message, startTime);
      return;
    }
    for (const validation of countryValidations) {
      await logValidation(
        'canonical_countries',
        validation.validation_rule,
        validation.validation_type,
        validation.is_valid,
        validation.error_message,
        validation.record_count,
        startTime
      );
      totalRecords += validation.record_count || 0;
      if (!validation.is_valid) {
        console.error(`Country validation failed: ${validation.validation_rule} - ${validation.error_message}`);
      }
    }

    // Validate canonical_indicators
    const { data: indicatorValidations, error: indicatorError } = await supabase
      .rpc('validate_canonical_indicators');
    if (indicatorError) {
      console.error('Indicator validation failed:', indicatorError.message);
      await updateIngestionLog(endpoint, 'failed', 0, indicatorError.message, startTime);
      return;
    }
    for (const validation of indicatorValidations) {
      await logValidation(
        'canonical_indicators',
        validation.validation_rule,
        validation.validation_type,
        validation.is_valid,
        validation.error_message,
        validation.record_count,
        startTime
      );
      totalRecords += validation.record_count || 0;
      if (!validation.is_valid) {
        console.error(`Indicator validation failed: ${validation.validation_rule} - ${validation.error_message}`);
      }
    }

    // Validate canonical_timeseries
    const { data: timeseriesValidations, error: timeseriesError } = await supabase
      .rpc('validate_canonical_timeseries');
    if (timeseriesError) {
      console.error('Timeseries validation failed:', timeseriesError.message);
      await updateIngestionLog(endpoint, 'failed', 0, timeseriesError.message, startTime);
      return;
    }
    for (const validation of timeseriesValidations) {
      await logValidation(
        'canonical_timeseries',
        validation.validation_rule,
        validation.validation_type,
        validation.is_valid,
        validation.error_message,
        validation.record_count,
        startTime
      );
      totalRecords += validation.record_count || 0;
      if (!validation.is_valid) {
        console.error(`Timeseries validation failed: ${validation.validation_rule} - ${validation.error_message}`);
      }
    }

    // Check if all validations passed
    const allValid = countryValidations.every(v => v.is_valid) &&
                     indicatorValidations.every(v => v.is_valid) &&
                     timeseriesValidations.every(v => v.is_valid);

    if (allValid) {
      console.log('All validations passed successfully');
      await updateIngestionLog(endpoint, 'success', totalRecords, null, startTime);
    } else {
      console.error('Some validations failed');
      await updateIngestionLog(endpoint, 'failed', totalRecords, 'Some validation rules failed', startTime);
    }
  } catch (err) {
    console.error('Unexpected error during validation:', err.message);
    await updateIngestionLog(endpoint, 'failed', 0, err.message, startTime);
  }
}

validateData();