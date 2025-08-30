-- Drop existing validation_log table to update schema
DROP TABLE IF EXISTS validation_log;

-- Create updated validation_log table with validation_type
CREATE TABLE validation_log (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    validation_rule VARCHAR(100) NOT NULL,
    validation_type VARCHAR(50) NOT NULL,
    is_valid BOOLEAN NOT NULL,
    error_message TEXT,
    record_count INTEGER NOT NULL,
    validated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    execution_time_ms INTEGER NOT NULL
);

-- Enable RLS
ALTER TABLE validation_log ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY service_role_access ON validation_log
    FOR ALL
    TO service_role
    USING (true);

-- Create policy for authenticated users (read-only)
CREATE POLICY auth_read_access ON validation_log
    FOR SELECT
    TO authenticated
    USING (true);