from sqlmodel import SQLModel
from app.db.engine import engine

# Importa todos os models para que SQLModel os registre
from app.models.piece import Piece  # noqa: F401
from app.models.box import Box  # noqa: F401


def init_db() -> None:
    """Inicializa o banco de dados criando todas as tabelas"""
    SQLModel.metadata.create_all(engine)
