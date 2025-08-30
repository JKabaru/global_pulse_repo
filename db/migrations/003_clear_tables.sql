-- Clear tables to remove stale data
DELETE FROM canonical_timeseries;
DELETE FROM canonical_indicators;
DELETE FROM raw_te_metadata WHERE endpoint_type = 'indicators';
DELETE FROM raw_te_timeseries;