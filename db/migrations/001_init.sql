-- Raw ingestion tables
CREATE TABLE raw_te_metadata (
    id SERIAL PRIMARY KEY,
    endpoint_type VARCHAR(50) NOT NULL, -- 'countries' | 'indicators'
    country_code VARCHAR(3),
    response_data JSONB NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    api_status_code INTEGER,
    content_hash VARCHAR(64) UNIQUE
);

CREATE TABLE raw_te_timeseries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    indicator_name VARCHAR(255) NOT NULL,
    date_value DATE NOT NULL,
    value_raw DECIMAL,
    unit_raw VARCHAR(50),
    source_url TEXT,
    release_date DATE,
    vintage_date DATE,
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content_hash VARCHAR(64),
    UNIQUE(country_code, indicator_name, date_value, vintage_date)
);

CREATE TABLE ingestion_log (
    id SERIAL PRIMARY KEY,
    run_id UUID DEFAULT gen_random_uuid(),
    endpoint VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'success' | 'failed' | 'retry'
    records_processed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    execution_time_ms INTEGER
);

-- Indexes
CREATE INDEX idx_raw_timeseries_country_indicator ON raw_te_timeseries(country_code, indicator_name);
CREATE INDEX idx_raw_timeseries_date ON raw_te_timeseries(date_value DESC);
CREATE INDEX idx_ingestion_log_run_id ON ingestion_log(run_id);

-- Enable RLS
ALTER TABLE raw_te_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_te_timeseries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY service_processing ON raw_te_metadata
    FOR ALL TO service_role
    USING (true);

CREATE POLICY service_processing ON raw_te_timeseries
    FOR ALL TO service_role
    USING (true);

CREATE POLICY service_processing ON ingestion_log
    FOR ALL TO service_role
    USING (true);