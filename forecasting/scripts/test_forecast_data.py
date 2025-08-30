import pandas as pd
from fetch_data import fetch_validated_data
from preprocess_data import preprocess_data
from forecast_data import forecast_data
from supabase import create_client, Client
from dotenv import load_dotenv
import os

def test_forecast_pipeline():
    try:
        # Load environment variables and initialize Supabase client
        load_dotenv()
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase = create_client(supabase_url, supabase_key)
        
        # 🎯 FIX: Clean up the database before the test run
        print("Cleaning up forecast_results table...")
        supabase.table("forecast_results").delete().gt("forecast_id", 0).execute()
        print("Cleanup complete.")

        # Fetch and preprocess data
        countries, indicators, timeseries = fetch_validated_data()
        preprocessed_data = preprocess_data(countries, indicators, timeseries)

        # Run forecasting
        forecast_results = forecast_data(preprocessed_data, countries, indicators)
        assert len(forecast_results) > 0, "No forecast results generated"
        assert all(r['forecast_value'] is not None for r in forecast_results), "Null forecast values found"
        assert all(r['forecast_horizon'] in ['1M', '3M', '6M'] for r in forecast_results), "Invalid forecast horizon"
        assert all(r['model_name'] == 'ARIMA(1,1,1)' for r in forecast_results), "Incorrect model name"

        # Verify storage in Supabase
        # Need to re-query the count after the forecast_data call
        stored_results = supabase.table("forecast_results").select("count").execute().data[0]['count']
        assert stored_results == len(forecast_results), f"Expected {len(forecast_results)} stored results, found {stored_results}"
        print("Forecast pipeline test passed")
    except Exception as e:
        print(f"Forecast test failed: {str(e)}")
        raise

if __name__ == "__main__":
    test_forecast_pipeline()