from sqlmodel import create_engine, Session
from app.core.config import get_settings

settings = get_settings()

# SQLite precisa de connect_args específico, PostgreSQL não
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(settings.database_url, echo=False, connect_args=connect_args)
else:
    # PostgreSQL e outros bancos não precisam de connect_args
    engine = create_engine(settings.database_url, echo=False)

def get_session():
    with Session(engine) as session:
        yield session
