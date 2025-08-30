import pandas as pd
from supabase import create_client, Client
from datetime import datetime
from dotenv import load_dotenv
import os
from fetch_data import fetch_validated_data
import map_taxonomy

def test_taxonomy_mapping():
    try:
        # Load environment variables
        load_dotenv()
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase = create_client(supabase_url, supabase_key)

        # Fetch and preprocess data
        countries, indicators, timeseries = fetch_validated_data()

        # 🎯 FIX: Call the function using module.function() syntax
        mappings = map_taxonomy.map_taxonomy(countries, indicators)
        
        # Verify that mappings were generated
        assert len(mappings) > 0, "No mappings were generated."

        # Verify storage in Supabase
        stored_results_count_response = supabase.table("taxonomy_mapping").select("count").execute()
        stored_results = stored_results_count_response.data[0]['count']
        
        # We've already confirmed the mapping logic is sound, so we test if the database stores the same number
        assert stored_results == len(mappings), f"Expected {len(mappings)} stored results, found {stored_results}"
        print("Taxonomy mapping test passed")

    except Exception as e:
        print(f"Taxonomy mapping test failed: {str(e)}")
        raise

if __name__ == "__main__":
    test_taxonomy_mapping()