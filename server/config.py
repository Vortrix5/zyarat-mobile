import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    # Server configuration
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    
    # OpenRouter configuration
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    openrouter_model: str = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-4-maverick:free")
    api_timeout: int = int(os.getenv("API_TIMEOUT", "60"))
    
    # Logging configuration
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    log_file: str = os.getenv("LOG_FILE", "logs/zyarat_server.log")
    
    # Testing configuration
    use_sample_data: bool = os.getenv("USE_SAMPLE_DATA", "False").lower() in ("true", "1", "t")
    
    class Config:
        env_file = ".env"
        
# Initialize settings
settings = Settings()

# Print warning if API key is not configured
if not settings.openrouter_api_key:
    print("WARNING: OPENROUTER_API_KEY not set in .env file. API calls will fail.")
