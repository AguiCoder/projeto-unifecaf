from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.db.init_db import init_db
from app.api.routes import api_router

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Sistema de controle de produção e qualidade de peças fabricadas",
    version="1.0.0"
)

# Configura CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_origins=[
    #     "http://localhost:5173",  # Vite dev server (porta padrão)
    #     "http://127.0.0.1:5173",  # Alternativa com IP local
    # ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Registra routers da API
app.include_router(api_router, prefix="/api")


@app.on_event("startup")
def on_startup():
    """Inicializa o banco de dados na inicialização da aplicação"""
    init_db()


@app.get("/health")
def health():
    """Endpoint de health check"""
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
