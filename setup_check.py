import sys
import os
from dotenv import load_dotenv

def check_environment():
    print("Checking environment setup...")
    print(f"Python version: {sys.version}")
    
    # Check virtual environment
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("ERROR: Virtual environment not active")
        sys.exit(1)
    
    # Check required packages
    try:
        import requests
        import psycopg2
        import dotenv
        import pytest
        import backoff
        print("All required Python packages installed")
    except ImportError as e:
        print(f"ERROR: Missing package - {e}")
        sys.exit(1)
    
    # Check environment variables
    load_dotenv()
    required_vars = ['TE_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        print(f"ERROR: Missing environment variables: {missing_vars}")
        sys.exit(1)
    
    # Check Node.js installation (optional for this stage)
    try:
        import subprocess
        node_version = subprocess.check_output(['node', '-v']).decode().strip()
        npm_version = subprocess.check_output(['npm', '-v']).decode().strip()
        print(f"Node.js version: {node_version}")
        print(f"npm version: {npm_version}")
    except subprocess.CalledProcessError:
        print("WARNING: Node.js not installed. It will be needed for n8n setup in later stages.")
    
    print("✅ Environment setup verified")

if __name__ == "__main__":
    check_environment()