import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.db.init_db import init_db
from app.api.routes import api_router

# Configura logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Sistema de controle de produção e qualidade de peças fabricadas",
    version="1.0.0"
)

# Configura CORS para permitir requisições do frontend
# IMPORTANTE: Não é possível usar allow_origins=["*"] com allow_credentials=True
# Se precisar de credentials, especifique as origens explicitamente
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens
    allow_credentials=False,  # Desabilitado quando usa wildcard
    allow_methods=["GET", "POST", "DELETE", "OPTIONS", "PUT", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Registra routers da API
app.include_router(api_router, prefix="/api")

# Flag para rastrear se o banco já foi inicializado
_db_initialized = False

@app.on_event("startup")
async def on_startup():
    """Inicializa o banco de dados na inicialização da aplicação"""
    global _db_initialized
    logger.info("Iniciando aplicação...")
    # Inicializa banco de forma não-bloqueante
    # Se falhar, não bloqueia o startup - tenta novamente na primeira requisição
    try:
        init_db()
        _db_initialized = True
        logger.info("Aplicação iniciada com sucesso!")
    except Exception as e:
        # Não levanta exceção para não bloquear o startup do FastAPI
        # O banco será inicializado na primeira requisição que precisar dele
        logger.warning(f"Banco não inicializado no startup: {e}. Será tentado novamente na primeira requisição.")
        logger.info("Aplicação iniciada (banco será inicializado sob demanda)")

@app.get("/health")
def health():
    """Endpoint de health check - não depende do banco estar pronto"""
    global _db_initialized
    
    # Tenta inicializar banco apenas uma vez se ainda não foi inicializado
    if not _db_initialized:
        try:
            init_db()
            _db_initialized = True
        except Exception:
            # Se falhar, não importa - healthcheck ainda retorna ok
            # O banco será tentado novamente na próxima requisição
            pass
    
    return {"status": "ok"}


@app.get("/")
def root():
    """Endpoint raiz com informações da API"""
    return {
        "message": "API Fabrica QA - Sistema de Controle de Produção e Qualidade",
        "docs": "/docs",
        "redoc": "/redoc",
        "version": "1.0.0"
    }
