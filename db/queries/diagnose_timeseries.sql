-- Count records per country and indicator
SELECT ct.country_code, ci.indicator_name, COUNT(*) AS record_count
FROM canonical_timeseries ct
JOIN canonical_indicators ci ON ct.indicator_id = ci.indicator_id
GROUP BY ct.country_code, ci.indicator_name
ORDER BY ct.country_code, ci.indicator_name;

-- Check for potential duplicates
SELECT country_code, indicator_id, date_value, vintage_date, COUNT(*) AS count
FROM canonical_timeseries
GROUP BY country_code, indicator_id, date_value, vintage_date
HAVING COUNT(*) > 1;
