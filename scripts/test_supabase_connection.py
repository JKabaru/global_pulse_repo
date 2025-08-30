import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def test_connection():
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password=os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
            host=os.getenv("SUPABASE_URL").replace("https://", ""),
            port=5432
        )
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print("Connection successful:", result)
        cursor.close()
        conn.close()
    except Exception as e:
        print("Connection failed:", str(e))

if __name__ == "__main__":
    test_connection()