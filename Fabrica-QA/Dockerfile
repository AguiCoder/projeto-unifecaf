# imagem base enxuta
FROM python:3.12-slim

# evita criação de .pyc e força stdout imediato
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

# instala dependências do sistema mínimas (se precisar psutil, libpq etc.)
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# primeiro só requirements para aproveitar cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# depois código
COPY app ./app
#COPY .env ./.env  # opcional: ou defina vars no ambiente da plataforma

EXPOSE 8000
# comando de produção (sem --reload)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]