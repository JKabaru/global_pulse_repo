import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

try:
    connection = psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME,
        sslmode="require"   # Supabase requires SSL
    )
    print("✅ Connection successful!")

    cursor = connection.cursor()
    cursor.execute("SELECT NOW();")
    print("⏰ Current Time:", cursor.fetchone())

    cursor.close()
    connection.close()
    print("🔒 Connection closed.")

except Exception as e:
    print(f"❌ Failed to connect: {e}")
