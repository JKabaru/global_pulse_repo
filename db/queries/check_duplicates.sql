-- Check for duplicates in raw_te_timeseries
SELECT country_code, indicator_name, date_value, vintage_date, COUNT(*) AS count
FROM raw_te_timeseries
GROUP BY country_code, indicator_name, date_value, vintage_date
HAVING COUNT(*) > 1;

-- Check distinct indicator names
SELECT DISTINCT indicator_name
FROM raw_te_timeseries
ORDER BY indicator_name;