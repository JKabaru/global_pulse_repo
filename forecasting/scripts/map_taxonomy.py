import pandas as pd
from supabase import create_client, Client
from datetime import datetime
from dotenv import load_dotenv
import os
from fetch_data import fetch_validated_data

# Load environment variables
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def map_taxonomy(countries, indicators):
    try:
        start_time = datetime.now()
        mappings = []

        # Fetch categories
        categories_response = supabase.table("categories").select("category_id, category_name").execute()
        categories = pd.DataFrame(categories_response.data)
        category_map = categories.set_index('category_name')['category_id'].to_dict()

        # Define keyword-based mapping rules
        category_keywords = {
            'Growth': ['gdp', 'industrial production', 'economic growth'],
            'Prices': ['cpi', 'ppi', 'inflation', 'price index'],
            'Labor': ['unemployment', 'employment', 'labor force'],
            'Trade': ['trade balance', 'export', 'import'],
            'Sentiment': ['consumer confidence', 'business confidence', 'sentiment']
        }

        # Map indicators to categories
        for _, indicator in indicators.iterrows():
            indicator_name = indicator['indicator_name'].lower()
            indicator_id = int(indicator['indicator_id'])
            matched_category_name = None
            provenance_rule = None

            # Try primary mapping
            for category_name, keywords in category_keywords.items():
                for keyword in keywords: # 🎯 FIX: Iterate through each keyword to find a match
                    if keyword in indicator_name:
                        matched_category_name = category_name
                        provenance_rule = f"Matched keyword: {keyword}" # 🎯 FIX: 'keyword' is now defined
                        break # Break out of the inner loop
                if matched_category_name:
                    break # Break out of the outer loop once a match is found
            
            # If a primary mapping is found, add it to the mappings list for all countries
            if matched_category_name:
                category_id = category_map.get(matched_category_name)
                for _, country in countries.iterrows():
                    country_code = country['country_code']
                    mappings.append({
                        'country_code': country_code,
                        'indicator_id': indicator_id,
                        'category_id': category_id,
                        'rank': 1,
                        'is_primary': True,
                        'fallback_reason': None,
                        'coverage_ratio': 1.0,
                        'provenance': {'source': 'keyword_mapping', 'rule': provenance_rule}
                    })

        # Store mappings in Supabase
        if mappings:
            # 🎯 FIX: Delete existing mappings using a valid column name
            supabase.table("taxonomy_mapping").delete().not_.is_('country_code', 'null').execute()
            supabase.table("taxonomy_mapping").insert(mappings).execute()
            print(f"Stored {len(mappings)} taxonomy mappings")

        # Log mapping run
        end_time = datetime.now()
        execution_time_ms = int((end_time - start_time).total_seconds() * 1000)
        log_entry = {
            "endpoint": "map_taxonomy",
            "status": "success",
            "records_processed": len(mappings),
            "error_message": None,
            "started_at": start_time.isoformat(),
            "completed_at": end_time.isoformat(),
            "execution_time_ms": execution_time_ms
        }
        supabase.table("ingestion_log").insert(log_entry).execute()

        return mappings
    except Exception as e:
        print(f"Error mapping taxonomy: {str(e)}")
        end_time = datetime.now()
        execution_time_ms = int((end_time - start_time).total_seconds() * 1000)
        log_entry = {
            "endpoint": "map_taxonomy",
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
    countries, indicators, _ = fetch_validated_data()
    mappings = map_taxonomy(countries, indicators)