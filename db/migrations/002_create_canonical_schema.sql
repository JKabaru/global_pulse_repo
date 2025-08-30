-- Canonical tables
CREATE TABLE canonical_countries (
    country_code VARCHAR(3) PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE canonical_indicators (
    indicator_id SERIAL PRIMARY KEY,
    indicator_name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(indicator_name)
);

CREATE TABLE canonical_timeseries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    indicator_id INTEGER NOT NULL,
    date_value DATE NOT NULL,
    value DECIMAL NOT NULL,
    unit VARCHAR(50),
    source_url TEXT,
    release_date DATE,
    vintage_date DATE,
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content_hash VARCHAR(64) NOT NULL,
    FOREIGN KEY (country_code) REFERENCES canonical_countries(country_code),
    FOREIGN KEY (indicator_id) REFERENCES canonical_indicators(indicator_id),
    UNIQUE(country_code, indicator_id, date_value, vintage_date)
);

-- Indexes
CREATE INDEX idx_canonical_timeseries_country_indicator ON canonical_timeseries(country_code, indicator_id);
CREATE INDEX idx_canonical_timeseries_date ON canonical_timeseries(date_value DESC);

-- Enable RLS
ALTER TABLE canonical_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE canonical_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE canonical_timeseries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY service_processing ON canonical_countries
    FOR ALL TO service_role
    USING (true);

CREATE POLICY service_processing ON canonical_indicators
    FOR ALL TO service_role
    USING (true);

CREATE POLICY service_processing ON canonical_timeseries
    FOR ALL TO service_role
    USING (true);