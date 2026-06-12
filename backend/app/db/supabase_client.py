import os
from supabase import create_client, Client
from app.core.config import settings

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_SERVICE_KEY

# Create client once and reuse it - no need to recreate on every request
_supabase_client: Client | None = None

def get_supabase() -> Client:
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(url, key)
        # Set timeout on the underlying httpx client
        if hasattr(_supabase_client, '_client') and hasattr(_supabase_client._client, 'timeout'):
            _supabase_client._client.timeout = 10.0
    return _supabase_client
