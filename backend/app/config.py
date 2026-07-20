from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Database
    database_url: str
    
    # Auth
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    
    # AI
    openai_api_key: str = ""
    mock_ai_mode: bool = True
    
    # File Upload
    max_upload_size_mb: int = 10
    upload_dir: str = "uploads"
    faiss_dir: str = "faiss_indexes"
    
    # CORS
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # App
    environment: str = "development"
    log_level: str = "INFO"
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

@lru_cache
def get_settings() -> Settings:
    return Settings()
