from functools import lru_cache
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()  # carrega .env em dev

class Settings(BaseModel):
    app_name: str = os.getenv("APP_NAME", "Fabrica QA")
    # DATABASE_URL pode ser SQLite (desenvolvimento) ou PostgreSQL (produção)
    # Exemplo PostgreSQL: postgresql://user:password@host:5432/dbname
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./fabrica.db")

@lru_cache
def get_settings() -> Settings:
    return Settings()
