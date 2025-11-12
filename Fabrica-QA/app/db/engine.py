from sqlmodel import create_engine, Session
from app.core.config import get_settings

settings = get_settings()

# SQLite precisa de connect_args específico, PostgreSQL não
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(settings.database_url, echo=False, connect_args=connect_args)
else:
    # PostgreSQL: adiciona pool_pre_ping para reconectar automaticamente
    # e pool_recycle para evitar conexões antigas
    # Para psycopg, connect_timeout deve ser passado na URL ou via connect_args
    engine = create_engine(
        settings.database_url,
        echo=False,
        pool_pre_ping=True,  # Verifica conexão antes de usar
        pool_recycle=300,    # Recicla conexões após 5 minutos
        pool_timeout=10,     # Timeout para obter conexão do pool
        connect_args={
            "connect_timeout": 10  # Timeout de 10 segundos para conexão inicial
        } if "postgresql" in settings.database_url else {}
    )

def get_session():
    with Session(engine) as session:
        yield session
