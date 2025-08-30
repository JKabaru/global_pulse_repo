-- Verify validation results
SELECT table_name, validation_rule, is_valid, error_message, record_count, validated_at
FROM validation_log
WHERE validated_at = (SELECT MAX(validated_at) FROM validation_log)
ORDER BY table_name, validation_rule;

-- Verify ingestion log for validation
SELECT endpoint, status, records_processed, error_message, started_at
FROM ingestion_log
WHERE endpoint = 'validate_data'
ORDER BY started_at DESC
LIMIT 1;