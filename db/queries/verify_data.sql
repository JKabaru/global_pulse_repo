-- Verify row counts
SELECT COUNT(*) AS metadata_count FROM raw_te_metadata WHERE endpoint_type = 'indicators';
SELECT COUNT(*) AS country_count FROM canonical_countries;
SELECT COUNT(*) AS indicator_count FROM canonical_indicators;
SELECT COUNT(*) AS timeseries_count FROM canonical_timeseries;

-- Verify indicator names
SELECT DISTINCT indicator_name FROM raw_te_timeseries;
SELECT indicator_name FROM canonical_indicators;

-- Verify ingestion logs
SELECT * FROM ingestion_log 
WHERE endpoint LIKE 'transform%' OR endpoint LIKE '%indicators%' 
ORDER BY started_at DESC 
LIMIT 5;