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

def visualize_taxonomy():
    try:
        # Fetch taxonomy mappings
        mappings = supabase.table("taxonomy_mapping")\
            .select("category_id")\
            .execute().data
        if not mappings:
            print("No taxonomy mappings found")
            return

        # Fetch categories
        categories = supabase.table("categories").select("category_id, category_name").execute().data
        categories_df = pd.DataFrame(categories)
        mappings_df = pd.DataFrame(mappings)

        # Count mappings per category
        counts = mappings_df['category_id'].value_counts().reset_index()
        counts = counts.merge(categories_df, left_on='category_id', right_on='category_id')
        
        # Create bar chart
        plt.figure(figsize=(8, 6), facecolor='#1E1E1E')
        ax = plt.gca()
        ax.set_facecolor('#2D2D2D')
        plt.bar(counts['category_name'], counts['count'], color='#4CAF50')
        plt.title('Taxonomy Mapping Distribution', color='white')
        plt.xlabel('Category', color='white')
        plt.ylabel('Number of Mappings', color='white')
        ax.tick_params(colors='white')
        plt.grid(True, color='gray', linestyle='--', alpha=0.5)
        plt.tight_layout()
        plt.savefig('taxonomy_distribution.png', facecolor='#1E1E1E', edgecolor='white')
        plt.close()
        print("Saved taxonomy distribution chart")
    except Exception as e:
        print(f"Visualization failed: {str(e)}")

if __name__ == "__main__":
    visualize_taxonomy()