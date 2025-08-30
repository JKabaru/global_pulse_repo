from supabase import create_client, Client
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def retrieve_timeseries():
    try:
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Fetch data from canonical_timeseries
        response = supabase.table("canonical_timeseries").select("country_code, indicator_id, date_value, value").execute()
        
        if not response.data:
            print("No data retrieved from canonical_timeseries")
            return None
            
        # Convert to DataFrame
        df = pd.DataFrame(response.data)
        df['date_value'] = pd.to_datetime(df['date_value'])
        
        print(f"Retrieved {len(df)} records from canonical_timeseries")
        return df
        
    except Exception as e:
        print(f"Error retrieving data: {str(e)}")
        return None

if __name__ == "__main__":
    retrieve_timeseries()