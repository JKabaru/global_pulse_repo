-- Drop existing validation functions
DROP FUNCTION IF EXISTS validate_canonical_countries;
DROP FUNCTION IF EXISTS validate_canonical_indicators;
DROP FUNCTION IF EXISTS validate_canonical_timeseries;

-- Create scalable validation function for canonical_countries
CREATE OR REPLACE FUNCTION validate_canonical_countries()
RETURNS TABLE (
    validation_rule VARCHAR,
    validation_type VARCHAR,
    is_valid BOOLEAN,
    error_message TEXT,
    record_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Rule 1: Non-null country_code and country_name
    SELECT 'non_null_fields'::VARCHAR AS validation_rule,
           'completeness'::VARCHAR AS validation_type,
           COUNT(*) = SUM(CASE WHEN country_code IS NOT NULL AND country_name IS NOT NULL THEN 1 ELSE 0 END) AS is_valid,
           CASE WHEN COUNT(*) != SUM(CASE WHEN country_code IS NOT NULL AND country_name IS NOT NULL THEN 1 ELSE 0 END)
                THEN 'Null values found in country_code or country_name' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER AS record_count
    FROM canonical_countries
    UNION
    -- Rule 2: Unique country_code
    SELECT 'unique_country_code'::VARCHAR,
           'completeness'::VARCHAR,
           COUNT(DISTINCT country_code) = COUNT(*) AS is_valid,
           CASE WHEN COUNT(DISTINCT country_code) != COUNT(*) THEN 'Duplicate country_code found' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER
    FROM canonical_countries
    UNION
    -- Rule 3: Valid ISO 3166-1 alpha-3 country_code
    SELECT 'valid_country_code_format'::VARCHAR,
           'format'::VARCHAR,
           COUNT(*) = SUM(CASE WHEN country_code ~ '^[A-Z]{3}$' THEN 1 ELSE 0 END) AS is_valid,
           CASE WHEN COUNT(*) != SUM(CASE WHEN country_code ~ '^[A-Z]{3}$' THEN 1 ELSE 0 END)
                THEN 'Invalid country_code format (must be 3-letter ISO 3166-1 alpha-3)' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER
    FROM canonical_countries;
END;
$$ LANGUAGE plpgsql;

-- Create scalable validation function for canonical_indicators
CREATE OR REPLACE FUNCTION validate_canonical_indicators()
RETURNS TABLE (
    validation_rule VARCHAR,
    validation_type VARCHAR,
    is_valid BOOLEAN,
    error_message TEXT,
    record_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Rule 1: Non-null indicator_name
    SELECT 'non_null_indicator_name'::VARCHAR AS validation_rule,
           'completeness'::VARCHAR AS validation_type,
           COUNT(*) = SUM(CASE WHEN indicator_name IS NOT NULL THEN 1 ELSE 0 END) AS is_valid,
           CASE WHEN COUNT(*) != SUM(CASE WHEN indicator_name IS NOT NULL THEN 1 ELSE 0 END)
                THEN 'Null indicator_name found' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER AS record_count
    FROM canonical_indicators
    UNION
    -- Rule 2: Unique indicator_name
    SELECT 'unique_indicator_name'::VARCHAR,
           'completeness'::VARCHAR,
           COUNT(DISTINCT indicator_name) = COUNT(*) AS is_valid,
           CASE WHEN COUNT(DISTINCT indicator_name) != COUNT(*) THEN 'Duplicate indicator_name found' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER
    FROM canonical_indicators;
END;
$$ LANGUAGE plpgsql;

-- Create scalable validation function for canonical_timeseries
CREATE OR REPLACE FUNCTION validate_canonical_timeseries()
RETURNS TABLE (
    validation_rule VARCHAR,
    validation_type VARCHAR,
    is_valid BOOLEAN,
    error_message TEXT,
    record_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Rule 1: Non-null critical fields
    SELECT 'non_null_fields'::VARCHAR AS validation_rule,
           'completeness'::VARCHAR AS validation_type,
           COUNT(*) = SUM(CASE WHEN country_code IS NOT NULL AND indicator_id IS NOT NULL AND date_value IS NOT NULL AND value IS NOT NULL THEN 1 ELSE 0 END) AS is_valid,
           CASE WHEN COUNT(*) != SUM(CASE WHEN country_code IS NOT NULL AND indicator_id IS NOT NULL AND date_value IS NOT NULL AND value IS NOT NULL THEN 1 ELSE 0 END)
                THEN 'Null values found in country_code, indicator_id, date_value, or value' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER AS record_count
    FROM canonical_timeseries
    UNION
    -- Rule 2: No future dates
    SELECT 'no_future_dates'::VARCHAR,
           'format'::VARCHAR,
           COUNT(*) = SUM(CASE WHEN date_value <= CURRENT_DATE THEN 1 ELSE 0 END) AS is_valid,
           CASE WHEN COUNT(*) != SUM(CASE WHEN date_value <= CURRENT_DATE THEN 1 ELSE 0 END)
                THEN 'Future date_value found' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER
    FROM canonical_timeseries
    UNION
    -- Rule 3: No duplicate records (country_code, indicator_id, date_value)
    SELECT 'no_duplicate_records'::VARCHAR,
           'completeness'::VARCHAR,
           COUNT(*) = COUNT(DISTINCT (country_code, indicator_id, date_value)) AS is_valid,
           CASE WHEN COUNT(*) != COUNT(DISTINCT (country_code, indicator_id, date_value))
                THEN 'Duplicate records found for (country_code, indicator_id, date_value)' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER
    FROM canonical_timeseries
    UNION
    -- Rule 4: Valid country_code foreign key
    SELECT 'valid_country_code_fk'::VARCHAR,
           'referential_integrity'::VARCHAR,
           COUNT(*) = SUM(CASE WHEN EXISTS (SELECT 1 FROM canonical_countries cc WHERE cc.country_code = ct.country_code) THEN 1 ELSE 0 END) AS is_valid,
           CASE WHEN COUNT(*) != SUM(CASE WHEN EXISTS (SELECT 1 FROM canonical_countries cc WHERE cc.country_code = ct.country_code) THEN 1 ELSE 0 END)
                THEN 'Invalid country_code foreign key' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER
    FROM canonical_timeseries ct
    UNION
    -- Rule 5: Valid indicator_id foreign key
    SELECT 'valid_indicator_id_fk'::VARCHAR,
           'referential_integrity'::VARCHAR,
           COUNT(*) = SUM(CASE WHEN EXISTS (SELECT 1 FROM canonical_indicators ci WHERE ci.indicator_id = ct.indicator_id) THEN 1 ELSE 0 END) AS is_valid,
           CASE WHEN COUNT(*) != SUM(CASE WHEN EXISTS (SELECT 1 FROM canonical_indicators ci WHERE ci.indicator_id = ct.indicator_id) THEN 1 ELSE 0 END)
                THEN 'Invalid indicator_id foreign key' ELSE NULL END AS error_message,
           COUNT(*)::INTEGER
    FROM canonical_timeseries ct;
END;
$$ LANGUAGE plpgsql;