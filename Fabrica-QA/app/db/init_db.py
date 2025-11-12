import time
import logging
from sqlalchemy.exc import OperationalError
from sqlmodel import SQLModel
from app.db.engine import engine

# Importa todos os models para que SQLModel os registre
from app.models.piece import Piece  # noqa: F401
from app.models.box import Box  # noqa: F401

logger = logging.getLogger(__name__)


def init_db() -> None:
    """Inicializa o banco de dados criando todas as tabelas com retry logic"""
    max_retries = 3  # Reduzido de 5 para 3 para evitar timeout muito longo
    retry_delay = 1  # Reduzido de 2 para 1 segundo para ser mais rápido
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Tentando inicializar banco de dados (tentativa {attempt + 1}/{max_retries})...")
            SQLModel.metadata.create_all(engine)
            logger.info("Banco de dados inicializado com sucesso!")
            return
        except OperationalError as e:
            if attempt < max_retries - 1:
                logger.warning(f"Erro ao conectar ao banco: {e}. Tentando novamente em {retry_delay}s...")
                time.sleep(retry_delay)
            else:
                logger.error(f"Falha ao inicializar banco de dados após {max_retries} tentativas: {e}")
                # Não levanta exceção para não bloquear o startup - tenta novamente na primeira requisição
                logger.warning("Aplicação iniciará sem banco inicializado. Tentará novamente na primeira requisição.")
                return
        except Exception as e:
            logger.error(f"Erro inesperado ao inicializar banco de dados: {e}")
            # Não levanta exceção para não bloquear o startup
            logger.warning("Aplicação iniciará sem banco inicializado. Tentará novamente na primeira requisição.")
            return
