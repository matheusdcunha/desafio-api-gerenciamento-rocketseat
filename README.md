# API de Gerenciamento de Tarefas

## Visão Geral
Esta API fornece uma solução completa para gerenciamento de tarefas, equipes e usuários em uma organização. Ela permite autenticação de usuários, criação e gerenciamento de equipes, atribuição de tarefas e acompanhamento do histórico de tarefas.

## Índice
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [URL Base](#url-base)
- [Autenticação](#autenticação)
- [Usuários](#usuários)
- [Equipes](#equipes)
- [Membros de Equipe](#membros-de-equipe)
- [Tarefas](#tarefas)
- [Histórico de Tarefas](#histórico-de-tarefas)

## Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Express** - Framework web para Node.js
- **Prisma** - ORM (Object-Relational Mapping) para acesso ao banco de dados
- **JWT (jsonwebtoken)** - Para autenticação e autorização
- **bcrypt** - Para criptografia de senhas
- **zod** - Para validação de dados
- **express-async-errors** - Para manipulação de erros assíncronos

### Ferramentas de Desenvolvimento
- **Jest** - Framework de testes
- **Supertest** - Biblioteca para testes de API
- **tsx** - Executor de TypeScript com suporte a ESM
- **tsup** - Empacotador de TypeScript
- **Docker/Docker Compose** - Conteinerização e orquestração de serviços

### Scripts Disponíveis
- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm test` - Executa os testes
- `npm run build` - Compila o projeto
- `npm start` - Inicia o servidor em modo de produção


## Configuração do Ambiente

### Pré-requisitos
- Node.js (v18.x ou superior recomendado)
- npm (v6.x ou superior)
- Docker e Docker Compose (opcional, para conteinerização)

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd desafio-gerenciador-tarefas-rocketseat
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/gerenciador_tarefas"
JWT_SECRET="sua_chave_secreta"
PORT=3333
```

4. Execute as migrações do banco de dados:
```bash
npm run prisma migrate dev
```

### Usando Docker (Opcional)

O projeto inclui suporte para Docker e Docker Compose para facilitar o ambiente de desenvolvimento.

Para iniciar os serviços usando Docker Compose:

```bash
docker-compose up -d
```

### Executando o Projeto

Para iniciar o servidor em modo de desenvolvimento:
```bash
npm run dev
```

Para executar os testes:
```bash
npm test
```

Para construir e executar em modo de produção:
```bash
npm run build
npm start
```

## URL Base
```
http://localhost:3333/
```

## Autenticação
A API utiliza JWT (JSON Web Token) para autenticação. A maioria dos endpoints requer autenticação e permissões específicas de função (administrador ou membro).

### Login
```
POST /auth
```

**Corpo da Requisição:**
```json
{
    "email": "usuario@email.com",
    "password": "senha"
}
```

**Resposta:**
Retorna um token JWT que deve ser incluído no cabeçalho de Autorização das requisições subsequentes.

**Exemplo:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Usuários

### Listar Todos os Usuários (Somente Admin)
```
GET /users
```

### Criar Usuário
```
POST /users
```

**Corpo da Requisição:**
```json
{
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "password": "senha"
}
```

### Atualizar Função do Usuário (Somente Admin)
```
PATCH /users/{user_id}
```

**Corpo da Requisição:**
```json
{
    "role": "admin"
}
```

### Atualizar Informações do Usuário
```
PUT /users/{user_id}
```

**Corpo da Requisição:**
```json
{
    "email": "novoemail@email.com"
}
```

### Excluir Usuário (Somente Admin)
```
DELETE /users/{user_id}
```

## Equipes

### Listar Todas as Equipes
```
GET /teams
```

### Criar Equipe (Somente Admin)
```
POST /teams
```

**Corpo da Requisição:**
```json
{
    "name": "Nome da Equipe",
    "description": "Descrição da equipe"
}
```

### Atualizar Informações da Equipe (Somente Admin)
```
PUT /teams/{team_id}
```

**Corpo da Requisição:**
```json
{
    "description": "Descrição atualizada da equipe"
}
```

### Excluir Equipe (Somente Admin)
```
DELETE /teams/{team_id}
```

## Membros de Equipe

### Listar Todos os Membros de Equipe
```
GET /teams_members
```

### Listar Usuários em uma Equipe
```
GET /teams_members/team/{team_id}
```

### Listar Equipes de um Usuário
```
GET /teams_members/user/{user_id}
```

### Adicionar Usuário a uma Equipe (Somente Admin)
```
POST /teams_members
```

**Corpo da Requisição:**
```json
{
    "userId": 1,
    "teamId": 1
}
```

### Atualizar Membro de Equipe (Somente Admin)
```
PUT /teams_members/{id}
```

**Corpo da Requisição:**
```json
{
    "userId": 1,
    "teamId": 2
}
```

## Tarefas

### Listar Tarefas do Usuário
Recupera tarefas atribuídas ao usuário autenticado.
```
GET /tasks
```

### Listar Todas as Tarefas (Somente Admin)
```
GET /tasks/admin
```

### Criar Tarefa (Somente Admin)
```
POST /tasks/{admin_id}
```

**Corpo da Requisição:**
```json
{
    "title": "Título da Tarefa",
    "description": "Descrição da tarefa",
    "priority": "high",
    "assignedTo": 1,
    "teamId": 1
}
```

### Atualizar Tarefa
```
PUT /tasks/{task_id}
```

**Corpo da Requisição:**
```json
{
    "status": "in_progress"
}
```

**Opções de Status da Tarefa:**
- pending (pendente)
- in_progress (em andamento)
- completed (concluída)

**Opções de Prioridade da Tarefa:**
- low (baixa)
- medium (média)
- high (alta)

## Histórico de Tarefas

### Listar Histórico de Tarefas (Somente Admin)
```
GET /task_histories
```

## Modelos de Dados

### Usuário
- id: número
- name: string (nome)
- email: string
- password: string (senha, criptografada)
- role: string (admin ou member)

### Equipe
- id: número
- name: string (nome)
- description: string (descrição)

### Membro de Equipe
- id: número
- userId: número (id do usuário)
- teamId: número (id da equipe)

### Tarefa
- id: número
- title: string (título)
- description: string (descrição)
- priority: string (low, medium, high - baixa, média, alta)
- status: string (pending, in_progress, completed - pendente, em andamento, concluída)
- assignedTo: número (id do usuário)
- teamId: número (id da equipe)
- createdBy: número (id do usuário criador)

### Histórico de Tarefa
- id: número
- taskId: número (id da tarefa)
- userId: número (id do usuário)
- oldStatus: string (status antigo)
- newStatus: string (status novo)
- timestamp: datetime (data e hora)

## Tratamento de Erros

A API retorna códigos de status HTTP apropriados junto com mensagens de erro:

- 200: OK
- 201: Criado
- 400: Requisição Inválida
- 401: Não Autorizado
- 403: Proibido
- 404: Não Encontrado
- 500: Erro Interno do Servidor