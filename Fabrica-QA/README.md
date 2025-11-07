# Sistema Fabrica QA

Sistema de automação digital para controle de produção e qualidade de peças fabricadas em linha de montagem industrial.

## 📋 Descrição

Este sistema foi desenvolvido em Python usando FastAPI para auxiliar no controle de produção e qualidade das peças fabricadas. O sistema automatiza o processo de inspeção que anteriormente era feito manualmente, reduzindo atrasos, falhas de conferência e custos de operação.

### Funcionalidades

- ✅ **Cadastro de Peças**: Recebe dados de cada peça produzida (id, peso, cor e comprimento)
- ✅ **Avaliação Automática**: Avalia automaticamente se a peça está aprovada ou reprovada conforme critérios de qualidade
- ✅ **Armazenamento em Caixas**: Armazena peças aprovadas em caixas com capacidade limitada (10 peças por caixa)
- ✅ **Fechamento Automático**: Fecha a caixa automaticamente quando atinge a capacidade máxima
- ✅ **Relatórios Consolidados**: Gera relatórios com estatísticas de produção

## 🎯 Critérios de Qualidade

Uma peça é **aprovada** se atender **todos** os critérios abaixo:

- **Peso**: entre 95g e 105g
- **Cor**: azul ou verde
- **Comprimento**: entre 10cm e 20cm

Caso contrário, a peça é **reprovada** e o sistema registra os motivos específicos da reprovação.

## 🛠️ Requisitos

- Python 3.12 ou superior
- pip (gerenciador de pacotes Python)

## 📦 Instalação

### 1. Clone o repositório (ou baixe os arquivos)

```bash
git clone <url-do-repositorio>
cd fabrica-qa
```

### 2. Crie um ambiente virtual (recomendado)

```bash
python -m venv venv
```

### 3. Ative o ambiente virtual

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

## 🚀 Como Executar

### 1. Execute o servidor

```bash
uvicorn app.main:app --reload
```

O servidor será iniciado em `http://localhost:8000`

### 2. Acesse a documentação interativa

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Estrutura do Projeto

```
fabrica-qa/
├── app/
│   ├── main.py              # Aplicação FastAPI principal
│   ├── api/
│   │   ├── deps.py          # Dependências (sessão DB)
│   │   ├── routes.py        # Agregação de routers
│   │   └── v1/
│   │       ├── pieces.py    # Endpoints de peças
│   │       ├── boxes.py     # Endpoints de caixas
│   │       └── reports.py   # Endpoints de relatórios
│   ├── core/
│   │   └── config.py        # Configurações
│   ├── db/
│   │   ├── engine.py        # Engine SQLModel
│   │   └── init_db.py       # Inicialização do banco
│   ├── models/
│   │   ├── enums.py         # Enums (Color, Status)
│   │   ├── piece.py         # Model Piece
│   │   └── box.py           # Model Box
│   ├── schemas/
│   │   ├── piece.py         # Schemas de peça
│   │   ├── box.py           # Schemas de caixa
│   │   └── report.py        # Schemas de relatório
│   └── services/
│       ├── quality_service.py   # Lógica de avaliação
│       ├── boxing_service.py    # Lógica de caixas
│       └── report_service.py    # Lógica de relatórios
├── requirements.txt
├── Dockerfile
└── README.md
```

## 📡 Endpoints da API

### 1. Cadastrar Nova Peça

**POST** `/api/v1/pieces`

Cadastra uma nova peça e avalia automaticamente sua qualidade.

**Request Body:**
```json
{
  "id": "P001",
  "peso": 100.0,
  "cor": "azul",
  "comprimento": 15.0
}
```

**Response (201 Created):**
```json
{
  "id": "P001",
  "peso": 100.0,
  "cor": "azul",
  "comprimento": 15.0,
  "status": "approved",
  "rejection_reasons": [],
  "box_id": 1,
  "created_at": "2024-01-01T12:00:00"
}
```

**Exemplo com peça reprovada:**
```json
{
  "id": "P002",
  "peso": 90.0,
  "cor": "vermelho",
  "comprimento": 25.0,
  "status": "rejected",
  "rejection_reasons": [
    "peso fora da faixa",
    "cor inválida",
    "comprimento fora da faixa"
  ],
  "box_id": null,
  "created_at": "2024-01-01T12:05:00"
}
```

### 2. Listar Peças

**GET** `/api/v1/pieces`

Lista peças cadastradas com filtros opcionais.

**Query Parameters:**
- `status` (opcional): `approved` ou `rejected`
- `limit` (opcional, padrão: 100): Limite de resultados (1-1000)
- `offset` (opcional, padrão: 0): Offset para paginação

**Exemplos:**
- Listar todas: `GET /api/v1/pieces`
- Filtrar aprovadas: `GET /api/v1/pieces?status=approved`
- Paginação: `GET /api/v1/pieces?limit=10&offset=0`

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "P001",
      "peso": 100.0,
      "cor": "azul",
      "comprimento": 15.0,
      "status": "approved",
      "rejection_reasons": [],
      "box_id": 1,
      "created_at": "2024-01-01T12:00:00"
    }
  ],
  "total": 1,
  "limit": 100,
  "offset": 0
}
```

### 3. Detalhes de Peça

**GET** `/api/v1/pieces/{piece_id}`

Retorna detalhes de uma peça específica.

**Response (200 OK):**
```json
{
  "id": "P001",
  "peso": 100.0,
  "cor": "azul",
  "comprimento": 15.0,
  "status": "approved",
  "rejection_reasons": [],
  "box_id": 1,
  "created_at": "2024-01-01T12:00:00"
}
```

### 4. Remover Peça

**DELETE** `/api/v1/pieces/{piece_id}`

Remove uma peça cadastrada.

**Response (204 No Content)**

### 5. Listar Caixas

**GET** `/api/v1/boxes`

Lista caixas cadastradas.

**Query Parameters:**
- `status` (opcional): `open` ou `closed`

**Exemplos:**
- Listar todas: `GET /api/v1/boxes`
- Apenas fechadas: `GET /api/v1/boxes?status=closed`

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "status": "closed",
      "opened_at": "2024-01-01T12:00:00",
      "closed_at": "2024-01-01T12:30:00",
      "piece_count": 10
    }
  ],
  "total": 1
}
```

### 6. Detalhes de Caixa

**GET** `/api/v1/boxes/{box_id}`

Retorna detalhes de uma caixa com lista de peças.

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "closed",
  "opened_at": "2024-01-01T12:00:00",
  "closed_at": "2024-01-01T12:30:00",
  "piece_count": 10,
  "pieces": [
    {
      "id": "P001",
      "peso": 100.0,
      "cor": "azul",
      "comprimento": 15.0,
      "status": "approved",
      "rejection_reasons": [],
      "box_id": 1,
      "created_at": "2024-01-01T12:00:00"
    }
  ]
}
```

### 7. Gerar Relatório Final

**GET** `/api/v1/reports/final`

Gera relatório consolidado com estatísticas de produção.

**Response (200 OK):**
```json
{
  "total_aprovadas": 25,
  "total_reprovadas": 5,
  "motivo_contagem": [
    {
      "motivo": "peso fora da faixa",
      "quantidade": 2
    },
    {
      "motivo": "cor inválida",
      "quantidade": 1
    },
    {
      "motivo": "comprimento fora da faixa",
      "quantidade": 2
    }
  ],
  "total_caixas": 3
}
```

## 🧪 Exemplos de Uso

### Exemplo 1: Cadastrar peça aprovada

```bash
curl -X POST "http://localhost:8000/api/v1/pieces" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "P001",
    "peso": 100.0,
    "cor": "azul",
    "comprimento": 15.0
  }'
```

### Exemplo 2: Cadastrar peça reprovada

```bash
curl -X POST "http://localhost:8000/api/v1/pieces" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "P002",
    "peso": 90.0,
    "cor": "vermelho",
    "comprimento": 25.0
  }'
```

### Exemplo 3: Listar peças aprovadas

```bash
curl "http://localhost:8000/api/v1/pieces?status=approved"
```

### Exemplo 4: Gerar relatório final

```bash
curl "http://localhost:8000/api/v1/reports/final"
```

### Exemplo 5: Listar caixas fechadas

```bash
curl "http://localhost:8000/api/v1/boxes?status=closed"
```

## 🐍 Exemplo em Python

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Cadastrar peça
response = requests.post(
    f"{BASE_URL}/pieces",
    json={
        "id": "P001",
        "peso": 100.0,
        "cor": "azul",
        "comprimento": 15.0
    }
)
print(response.json())

# Listar peças aprovadas
response = requests.get(f"{BASE_URL}/pieces?status=approved")
print(response.json())

# Gerar relatório
response = requests.get(f"{BASE_URL}/reports/final")
print(response.json())
```

## 🧪 Testando via Interface Web

A forma mais fácil de testar a API é usando a documentação interativa:

1. Inicie o servidor: `uvicorn app.main:app --reload`
2. Acesse http://localhost:8000/docs
3. Use a interface Swagger para testar todos os endpoints
4. Clique em "Try it out" em qualquer endpoint
5. Preencha os dados e clique em "Execute"

## 🗄️ Banco de Dados

O sistema usa **SQLite** para desenvolvimento, criando automaticamente o arquivo `fabrica.db` na raiz do projeto na primeira execução.

As tabelas são criadas automaticamente na inicialização da aplicação.

## 🐳 Docker

Para executar com Docker:

```bash
docker build -t fabrica-qa .
docker run -p 8000:8000 fabrica-qa
```

## 📝 Notas Técnicas

- **FastAPI**: Framework web moderno e rápido
- **SQLModel**: ORM baseado em SQLAlchemy e Pydantic
- **Pydantic**: Validação de dados e serialização
- **Type Hints**: Tipagem completa para melhor desenvolvimento
- **Documentação Automática**: Swagger UI e ReDoc gerados automaticamente

## 🔧 Configuração

As configurações podem ser ajustadas via variáveis de ambiente ou arquivo `.env`:

- `APP_NAME`: Nome da aplicação (padrão: "Fabrica QA")
- `DATABASE_URL`: URL do banco de dados (padrão: "sqlite:///./fabrica.db")

## 📊 Fluxo de Funcionamento

1. **Cadastro**: Peça é cadastrada via API
2. **Avaliação**: Sistema avalia automaticamente os critérios de qualidade
3. **Alocação**: Se aprovada, peça é alocada em caixa (cria nova se necessário)
4. **Fechamento**: Quando caixa atinge 10 peças, é fechada automaticamente
5. **Relatórios**: Sistema gera relatórios consolidados com estatísticas

## 🎓 Aprendizado

Este projeto demonstra:

- Arquitetura em camadas (Models, Schemas, Services, API)
- Injeção de dependências com FastAPI
- Validação automática com Pydantic
- Relacionamentos entre modelos com SQLModel
- Documentação automática de API
- Boas práticas de organização de código Python

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

