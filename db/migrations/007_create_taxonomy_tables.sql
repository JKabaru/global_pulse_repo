-- Create categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(20) UNIQUE NOT NULL CHECK (category_name IN ('Growth', 'Prices', 'Labor', 'Trade', 'Sentiment')),
    description TEXT
);

-- Create taxonomy_mapping table
CREATE TABLE taxonomy_mapping (
    mapping_id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) REFERENCES canonical_countries(country_code),
    category_id INTEGER REFERENCES categories(category_id),
    indicator_id INTEGER REFERENCES canonical_indicators(indicator_id),
    rank INTEGER NOT NULL CHECK (rank >= 1),
    is_primary BOOLEAN DEFAULT FALSE,
    fallback_reason TEXT,
    coverage_ratio DECIMAL(5,4),
    mapping_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    provenance JSONB,
    UNIQUE(country_code, category_id, rank)
);

-- Indexes
CREATE INDEX idx_taxonomy_mapping_country_category ON taxonomy_mapping(country_code, category_id);

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_processing ON categories FOR ALL TO service_role USING (true);

-- Enable RLS for taxonomy_mapping
ALTER TABLE taxonomy_mapping ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_processing ON taxonomy_mapping FOR ALL TO service_role USING (true);