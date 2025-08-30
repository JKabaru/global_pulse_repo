import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def fetch_validated_data():
    try:
        # Fetch canonical_countries
        countries_response = supabase.table("canonical_countries").select("country_code, country_name").execute()
        countries = pd.DataFrame(countries_response.data)
        print(f"Fetched {len(countries)} countries")

        # Fetch canonical_indicators (no 'unit' column needed here)
        indicators_response = supabase.table("canonical_indicators").select("indicator_id, indicator_name").execute()
        indicators = pd.DataFrame(indicators_response.data)
        print(f"Fetched {len(indicators)} indicators")

        # Fetch canonical_timeseries (this table already has the 'unit' column)
        timeseries_response = supabase.table("canonical_timeseries").select("country_code, indicator_id, date_value, value, unit").execute()
        timeseries = pd.DataFrame(timeseries_response.data)
        print(f"Fetched {len(timeseries)} timeseries records")

        return countries, indicators, timeseries
    except Exception as e:
        print(f"Error fetching data: {str(e)}")
        raise

if __name__ == "__main__":
    countries, indicators, timeseries = fetch_validated_data()