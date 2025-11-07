# Coleção Postman - Fabrica QA API

Este diretório contém a coleção completa do Postman para testar todos os endpoints da API Fabrica QA.

## Arquivos

- **Fabrica_QA_API.postman_collection.json** - Coleção completa com todos os endpoints
- **Fabrica_QA_Environment.postman_environment.json** - Variáveis de ambiente para facilitar o uso

## Como Importar

### 1. Importar Coleção

1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Selecione o arquivo `Fabrica_QA_API.postman_collection.json`
4. Clique em **Import**

### 2. Importar Ambiente (Opcional)

1. No Postman, clique em **Environments** (canto superior esquerdo)
2. Clique em **Import**
3. Selecione o arquivo `Fabrica_QA_Environment.postman_environment.json`
4. Clique em **Import**
5. Selecione o ambiente "Fabrica QA - Local" no seletor de ambientes (canto superior direito)

## Estrutura da Coleção

A coleção está organizada em 4 pastas:

### 1. Geral
- **Health Check** - Verifica se a API está funcionando
- **Root - Informações da API** - Retorna informações sobre a API

### 2. Peças
- **Cadastrar Nova Peça** - POST para criar uma nova peça
- **Listar Todas as Peças** - GET sem filtros
- **Listar Peças Aprovadas** - GET com filtro `status=approved`
- **Listar Peças Reprovadas** - GET com filtro `status=rejected`
- **Listar Peças com Paginação** - GET com `limit` e `offset`
- **Obter Peça por ID** - GET por ID específico
- **Remover Peça** - DELETE por ID

### 3. Caixas
- **Listar Todas as Caixas** - GET sem filtros
- **Listar Caixas Fechadas** - GET com filtro `status=closed`
- **Listar Caixas Abertas** - GET com filtro `status=open`
- **Obter Caixa por ID** - GET por ID com lista de peças

### 4. Relatórios
- **Gerar Relatório Final** - GET com estatísticas consolidadas

## Variáveis de Ambiente

A coleção usa as seguintes variáveis:

- `{{base_url}}` - URL base da API (padrão: `http://localhost:8000`)
- `{{piece_id}}` - ID de uma peça para testes (padrão: `P001`)
- `{{box_id}}` - ID de uma caixa para testes (padrão: `1`)

## Como Usar

### 1. Iniciar o Servidor

Antes de testar, certifique-se de que o servidor está rodando:

```bash
uvicorn app.main:app --reload
```

### 2. Testar Endpoints

1. Selecione um endpoint na coleção
2. Clique em **Send** para enviar a requisição
3. Veja a resposta no painel inferior

### 3. Exemplos de Fluxo

#### Fluxo Completo - Cadastrar e Listar Peças

1. **Cadastrar Nova Peça** (POST)
   - Use o exemplo de peça aprovada no body
   - A peça será automaticamente alocada em uma caixa

2. **Listar Peças Aprovadas** (GET)
   - Verifique se a peça aparece na lista

3. **Obter Peça por ID** (GET)
   - Use o ID retornado no cadastro
   - Veja os detalhes completos

#### Fluxo - Testar Reprovação

1. **Cadastrar Nova Peça** (POST)
   - Use o exemplo de peça reprovada (peso fora da faixa, cor inválida, etc.)
   - Veja os motivos de reprovação na resposta

2. **Listar Peças Reprovadas** (GET)
   - Verifique se a peça aparece na lista de reprovadas

#### Fluxo - Verificar Caixas

1. **Cadastrar 10 Peças Aprovadas** (POST)
   - Cadastre 10 peças que atendam os critérios
   - A 10ª peça fechará automaticamente a caixa

2. **Listar Caixas Fechadas** (GET)
   - Verifique se a caixa aparece como fechada

3. **Obter Caixa por ID** (GET)
   - Veja todas as peças dentro da caixa

#### Fluxo - Relatório Final

1. **Gerar Relatório Final** (GET)
   - Veja estatísticas consolidadas de todas as peças e caixas

## Exemplos de Body para POST

### Peça Aprovada
```json
{
    "id": "P001",
    "peso": 100.0,
    "cor": "azul",
    "comprimento": 15.0
}
```

### Peça Reprovada (peso fora da faixa)
```json
{
    "id": "P002",
    "peso": 90.0,
    "cor": "azul",
    "comprimento": 15.0
}
```

### Peça Reprovada (cor inválida)
```json
{
    "id": "P003",
    "peso": 100.0,
    "cor": "vermelho",
    "comprimento": 15.0
}
```

### Peça Reprovada (comprimento fora da faixa)
```json
{
    "id": "P004",
    "peso": 100.0,
    "cor": "azul",
    "comprimento": 25.0
}
```

## Critérios de Aprovação

Uma peça é **aprovada** se atender **todos** os critérios:

- **Peso**: entre 95g e 105g
- **Cor**: azul ou verde
- **Comprimento**: entre 10cm e 20cm

## Notas

- Todos os endpoints retornam JSON
- Os códigos de status HTTP seguem os padrões REST
- As respostas incluem exemplos de sucesso e erro
- Use as variáveis de ambiente para facilitar os testes

## Troubleshooting

### Erro de Conexão
- Verifique se o servidor está rodando em `http://localhost:8000`
- Verifique se a variável `{{base_url}}` está configurada corretamente

### Erro 404
- Verifique se o ID usado existe no banco de dados
- Use o endpoint de listagem para ver IDs disponíveis

### Erro 400
- Verifique o formato do JSON no body
- Certifique-se de que os campos obrigatórios estão presentes
- Verifique se os valores estão dentro dos limites permitidos

