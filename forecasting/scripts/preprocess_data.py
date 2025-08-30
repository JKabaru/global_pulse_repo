import pandas as pd
import numpy as np
from supabase import create_client, Client
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def preprocess_data(countries, indicators, timeseries):
    try:
        start_time = datetime.now()
        
        # Merge timeseries and indicators dataframes
        timeseries_merged = pd.merge(timeseries, indicators, on='indicator_id')
        
        # Convert date_value to datetime
        timeseries_merged['date_value'] = pd.to_datetime(timeseries_merged['date_value'])

        # Handle missing values (forward fill, then backward fill)
        timeseries_merged = timeseries_merged.sort_values(['country_code', 'indicator_name', 'date_value'])
        timeseries_merged['value'] = timeseries_merged.groupby(['country_code', 'indicator_name'])['value'].ffill().bfill()

        # Standardize units
        unit_map = {
            'USD Billion': 1e9,
            'Percent': 1,
            'USD Million': 1e6
        }
        timeseries_merged['value_standardized'] = timeseries_merged.apply(
            lambda row: row['value'] * unit_map.get(row['unit'], 1), axis=1
        )

        # Pivot data for forecasting
        pivoted_data = timeseries_merged.pivot_table(
            index='date_value',
            columns=['country_code', 'indicator_name'],
            values='value_standardized',
            aggfunc='mean'
        )
        
        # 🎯 FIX: Create a complete MultiIndex and reindex the pivoted data
        all_columns = pd.MultiIndex.from_product(
            [countries['country_code'].unique(), indicators['indicator_name'].unique()],
            names=['country_code', 'indicator_name']
        )
        pivoted_data = pivoted_data.reindex(columns=all_columns)

        # Flatten the MultiIndex columns
        pivoted_data.columns = [f'{col[0]}_{col[1]}' for col in pivoted_data.columns]
        pivoted_data = pivoted_data.reset_index()

        # Log preprocessing run
        end_time = datetime.now()
        execution_time_ms = int((end_time - start_time).total_seconds() * 1000)
        log_entry = {
            "endpoint": "preprocess_data",
            "status": "success",
            "records_processed": len(timeseries_merged),
            "error_message": None,
            "started_at": start_time.isoformat(),
            "completed_at": end_time.isoformat(),
            "execution_time_ms": execution_time_ms
        }
        supabase.table("ingestion_log").insert(log_entry).execute()

        print(f"Preprocessed {len(pivoted_data)} records")
        return pivoted_data
    except Exception as e:
        print(f"Error preprocessing data: {str(e)}")
        end_time = datetime.now()
        execution_time_ms = int((end_time - start_time).total_seconds() * 1000)
        log_entry = {
            "endpoint": "preprocess_data",
            "status": "failed",
            "records_processed": 0,
            "error_message": str(e),
            "started_at": start_time.isoformat(),
            "completed_at": end_time.isoformat(),
            "execution_time_ms": execution_time_ms
        }
        supabase.table("ingestion_log").insert(log_entry).execute()
        raise
        
if __name__ == "__main__":
    from fetch_data import fetch_validated_data
    countries, indicators, timeseries = fetch_validated_data()
    preprocessed_data = preprocess_data(countries, indicators, timeseries)