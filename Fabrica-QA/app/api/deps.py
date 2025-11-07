from fastapi import Depends
from sqlmodel import Session
from app.db.engine import get_session


def get_db_session(session: Session = Depends(get_session)) -> Session:
    """
    Dependency injection para sessão do banco de dados.
    
    Usado em todos os endpoints que precisam acessar o banco.
    """
    return session

