# Variáveis de Ambiente

Este arquivo documenta as variáveis de ambiente necessárias para executar a aplicação.

## Backend - Fabrica-QA

### APP_NAME
Nome da aplicação.
- **Padrão**: `Fabrica QA`
- **Exemplo**: `APP_NAME=Fabrica QA`

### DATABASE_URL
URL de conexão com o banco de dados.

**Para SQLite (desenvolvimento local):**
```
DATABASE_URL=sqlite:///./fabrica.db
```

**Para PostgreSQL (produção/Docker):**
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/fabrica_qa
```

Formato PostgreSQL: `postgresql://usuario:senha@host:porta/nome_banco`

## Frontend - industrial-dashboard

### VITE_API_URL
URL da API backend para o frontend se conectar.

**Em desenvolvimento local:**
```
VITE_API_URL=http://localhost:8000
```

**Em produção/Docker:**
```
VITE_API_URL=http://localhost:8000
```

**Nota**: No Docker Compose, o frontend precisa usar o nome do serviço do backend ou a URL externa.

## PostgreSQL (configurado no docker-compose.yml)

As seguintes variáveis são configuradas diretamente no `docker-compose.yml`:

- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=postgres`
- `POSTGRES_DB=fabrica_qa`

**Importante**: Em produção, altere as senhas padrão!

## Como Usar

1. Copie este arquivo para `.env` na raiz do projeto (se necessário)
2. Ou configure as variáveis diretamente no `docker-compose.yml`
3. Para desenvolvimento local, crie um arquivo `.env` em cada projeto

