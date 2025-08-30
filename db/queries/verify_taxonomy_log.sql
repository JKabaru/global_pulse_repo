-- Verify taxonomy mapping log
SELECT endpoint, status, records_processed, error_message, started_at
FROM ingestion_log
WHERE endpoint = 'map_taxonomy'
ORDER BY started_at DESC
LIMIT 1;