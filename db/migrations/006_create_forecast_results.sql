-- Create forecast_results table
CREATE TABLE forecast_results (
    forecast_id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) REFERENCES canonical_countries(country_code),
    indicator_id INTEGER REFERENCES canonical_indicators(indicator_id),
    forecast_date DATE NOT NULL,
    forecast_value FLOAT NOT NULL,
    forecast_horizon VARCHAR(10) NOT NULL, -- e.g., '1M', '3M', '6M'
    model_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confidence_interval_lower FLOAT,
    confidence_interval_upper FLOAT
);

-- Enable RLS
ALTER TABLE forecast_results ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY service_role_access ON forecast_results
    FOR ALL
    TO service_role
    USING (true);

-- Create policy for authenticated users (read-only)
CREATE POLICY auth_read_access ON forecast_results
    FOR SELECT
    TO authenticated
    USING (true);