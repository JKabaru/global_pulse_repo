import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from supabase import create_client, Client
from datetime import datetime
from dotenv import load_dotenv
import os
from preprocess_data import preprocess_data
from fetch_data import fetch_validated_data

# Load environment variables
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def forecast_data(preprocessed_data, countries, indicators, horizons=['1M', '3M', '6M']):
    try:
        start_time = datetime.now()
        forecast_results = []

        # Iterate over each country-indicator pair
        for column in preprocessed_data.columns:
            if column == 'date_value':
                continue
            country_code, indicator_name = column.split('_', 1)
            
            indicator_id_match = indicators[indicators['indicator_name'] == indicator_name]['indicator_id']
            if indicator_id_match.empty:
                print(f"Skipping {column}: Indicator name not found in indicators table.")
                continue
            
            # Explicitly convert the indicator_id to a standard Python int
            indicator_id = int(indicator_id_match.iloc[0])

            # Extract and prepare time series for the column
            series = preprocessed_data[['date_value', column]]
            series.set_index('date_value', inplace=True)
            series = series.dropna()

            # Resample to a consistent monthly frequency and fill gaps
            series_monthly = series.resample('ME').mean().interpolate(method='linear')
            
            if len(series_monthly) < 12:
                print(f"Skipping {column}: Insufficient data ({len(series_monthly)} monthly points)")
                continue

            # Fit ARIMA model
            try:
                # Ensure the index is a datetime index and use the resampled series
                model = ARIMA(series_monthly, order=(1,1,1), freq='ME')
                model_fit = model.fit()

                # Generate forecasts for each horizon
                for horizon in horizons:
                    steps = {'1M': 1, '3M': 3, '6M': 6}[horizon]
                    
                    # Use get_forecast to get forecast values and confidence intervals at once
                    forecast_obj = model_fit.get_forecast(steps=steps)
                    forecast_value = forecast_obj.predicted_mean.iloc[-1]
                    conf_int = forecast_obj.conf_int(alpha=0.05)
                    conf_lower = conf_int.iloc[-1, 0]
                    conf_upper = conf_int.iloc[-1, 1]
                    forecast_date = forecast_obj.predicted_mean.index[-1].strftime('%Y-%m-%d')
                    
                    forecast_results.append({
                        'country_code': country_code,
                        'indicator_id': indicator_id,
                        'forecast_date': forecast_date,
                        'forecast_value': float(forecast_value),
                        'forecast_horizon': horizon,
                        'model_name': 'ARIMA(1,1,1)',
                        'confidence_interval_lower': float(conf_lower),
                        'confidence_interval_upper': float(conf_upper)
                    })
            except Exception as e:
                print(f"Forecast failed for {column}: {str(e)}")
                continue

        # Store results in Supabase
        if forecast_results:
            supabase.table("forecast_results").insert(forecast_results).execute()
            print(f"Stored {len(forecast_results)} forecast results")

        # Log forecasting run
        end_time = datetime.now()
        execution_time_ms = int((end_time - start_time).total_seconds() * 1000)
        log_entry = {
            "endpoint": "forecast_data",
            "status": "success",
            "records_processed": len(forecast_results),
            "error_message": None,
            "started_at": start_time.isoformat(),
            "completed_at": end_time.isoformat(),
            "execution_time_ms": execution_time_ms
        }
        supabase.table("ingestion_log").insert(log_entry).execute()

        return forecast_results
    except Exception as e:
        print(f"Error forecasting data: {str(e)}")
        end_time = datetime.now()
        execution_time_ms = int((end_time - start_time).total_seconds() * 1000)
        log_entry = {
            "endpoint": "forecast_data",
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
    countries, indicators, timeseries = fetch_validated_data()
    preprocessed_data = preprocess_data(countries, indicators, timeseries)
    forecast_results = forecast_data(preprocessed_data, countries, indicators)