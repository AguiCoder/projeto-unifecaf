# Sistema Fabrica QA

Sistema de controle de produção e qualidade de peças fabricadas. Avalia automaticamente peças conforme critérios de qualidade (peso, cor, comprimento) e organiza peças aprovadas em caixas de 10 unidades.

## Requisitos

- Docker e Docker Compose

## Desenvolvimento Local

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Acessos:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432 (user: postgres, pass: postgres, db: fabrica_qa)

**Comandos úteis:**
```bash
# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar serviços
docker-compose -f docker-compose.dev.yml down

# Parar e limpar volumes
docker-compose -f docker-compose.dev.yml down -v
```

## Produção

```bash
docker-compose up -d --build
```

**Nota:** Configure `VITE_API_URL` no build do frontend conforme seu ambiente de produção.

## Estrutura

- `Fabrica-QA/` - Backend (FastAPI + PostgreSQL)
- `industrial-dashboard/` - Frontend (React + Vite)
- `docker-compose.yml` - Configuração produção
- `docker-compose.dev.yml` - Configuração desenvolvimento

