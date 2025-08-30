import psycopg2
from dotenv import load_dotenv
import os
from contextlib import contextmanager

load_dotenv()

@contextmanager
def get_db_connection():
    """Create a database connection to Supabase with SSL."""
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password=os.getenv("SUPABASE_KEY"),
            host=os.getenv("SUPABASE_URL").replace("https://", "").replace("/rest/v1", ""),
            port=5432,
            sslmode="require",
            fallback_application_name="your_app_name" # Add this line
        )
        yield conn
    except psycopg2.Error as e:
        print(f"ERROR: Database connection failed - {e}")
        raise
    finally:
        if 'conn' in locals():
            conn.close()

def test_connection():
    """Test database connection and table existence."""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Check if tables exist
                cur.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name IN ('countries', 'indicators_metadata', 'raw_data', 'audit_logs')
                """)
                tables = [row[0] for row in cur.fetchall()]
                expected_tables = ['countries', 'indicators_metadata', 'raw_data', 'audit_logs']
                if set(tables) == set(expected_tables):
                    print("✅ All expected tables exist:", tables)
                else:
                    print(f"ERROR: Missing tables. Found: {tables}, Expected: {expected_tables}")
                    raise ValueError("Table verification failed")
    except Exception as e:
        print(f"ERROR: Connection test failed - {e}")
        raise

if __name__ == "__main__":
    test_connection()