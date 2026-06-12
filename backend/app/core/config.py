from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str = "https://dummy.supabase.co"
    SUPABASE_SERVICE_KEY: str = "dummy-service-key"
    SUPABASE_JWT_SECRET: str = "dummy-jwt-secret"
    
    class Config:
        env_file = ".env"

settings = Settings()
