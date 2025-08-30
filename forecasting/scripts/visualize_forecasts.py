import pandas as pd
import matplotlib.pyplot as plt
from supabase import create_client
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def visualize_forecasts(country_code, indicator_name):
    # Fetch forecast results
    results = supabase.table("forecast_results")\
        .select("forecast_date, forecast_value, forecast_horizon, confidence_interval_lower, confidence_interval_upper")\
        .eq("country_code", country_code)\
        .eq("model_name", "ARIMA(1,1,1)")\
        .execute().data
    
    if not results:
        print(f"No forecast data for {country_code}_{indicator_name}")
        return

    df = pd.DataFrame(results)
    df['forecast_date'] = pd.to_datetime(df['forecast_date'])

    # Create chart
    plt.figure(figsize=(10, 6), facecolor='#1E1E1E')
    ax = plt.gca()
    ax.set_facecolor('#2D2D2D')

    for horizon in df['forecast_horizon'].unique():
        horizon_data = df[df['forecast_horizon'] == horizon]
        plt.plot(horizon_data['forecast_date'], horizon_data['forecast_value'], marker='o', label=f'{horizon} Forecast')
        plt.fill_between(horizon_data['forecast_date'], 
                        horizon_data['confidence_interval_lower'], 
                        horizon_data['confidence_interval_upper'], 
                        alpha=0.2)

    plt.title(f'Forecast for {country_code}_{indicator_name}', color='white')
    plt.xlabel('Date', color='white')
    plt.ylabel('Value', color='white')
    plt.legend(facecolor='#2D2D2D', edgecolor='white', labelcolor='white')
    plt.grid(True, color='gray', linestyle='--', alpha=0.5)
    ax.tick_params(colors='white')
    plt.tight_layout()
    plt.savefig(f'forecast_{country_code}_{indicator_name}.png', facecolor='#1E1E1E', edgecolor='white')
    plt.close()
    print(f"Saved forecast chart for {country_code}_{indicator_name}")

if __name__ == "__main__":
    visualize_forecasts("MEX", "GDP")