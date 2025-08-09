# Documentação da API

## Visão Geral

Esta é uma API REST desenvolvida em Node.js com Express e TypeScript para um sistema de agendamentos. A API fornece funcionalidades para autenticação de usuários, gerenciamento de perfis, criação de agendamentos e consulta de prestadores de serviços.

**Base URL:** `http://localhost:3333`

**Rate Limiting:** A API possui limitação de taxa implementada para prevenir abuso.

---

## Autenticação

A API utiliza autenticação baseada em JWT (JSON Web Token). Para acessar rotas protegidas, é necessário incluir o token no header da requisição:

```
Authorization: Bearer <token>
```

---

## Rotas da API

### 1. Autenticação (`/sessions`)

#### POST `/sessions`
Autentica um usuário no sistema.

**Autenticação:** Não requerida  
**Método:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Validação:**
- `email`: string, formato de email válido, obrigatório
- `password`: string, obrigatório

**Response Success (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_aqui"
}
```

**Response Error (401):**
```json
{
  "status": "error",
  "message": "Incorrect email/password combination."
}
```

---

### 2. Usuários (`/users`)

#### POST `/users`
Cria um novo usuário no sistema.

**Autenticação:** Não requerida  
**Método:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Validação:**
- `name`: string, obrigatório
- `email`: string, formato de email válido, obrigatório
- `password`: string, obrigatório

**Response Success (200):**
```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**Response Error (400):**
```json
{
  "status": "error",
  "message": "Email address already used."
}
```

#### PATCH `/users/avatar`
Atualiza o avatar do usuário autenticado.

**Autenticação:** Requerida  
**Método:** PATCH  
**Content-Type:** multipart/form-data

**Request Body:**
- `avatar`: arquivo de imagem (form-data)

**Response Success (200):**
```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "avatar": "hash-avatar.jpg",
  "avatar_url": "http://localhost:3333/files/hash-avatar.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

---

### 3. Perfil (`/profile`)

#### GET `/profile`
Obtém os dados do perfil do usuário autenticado.

**Autenticação:** Requerida  
**Método:** GET

**Response Success (200):**
```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "avatar": "hash-avatar.jpg",
  "avatar_url": "http://localhost:3333/files/hash-avatar.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

#### PUT `/profile`
Atualiza os dados do perfil do usuário autenticado.

**Autenticação:** Requerida  
**Método:** PUT  
**Content-Type:** application/json

**Request Body:**
```json
{
  "name": "Novo Nome",
  "email": "novo@exemplo.com",
  "old_password": "senhaAtual",
  "password": "novaSenha",
  "password_confirmation": "novaSenha"
}
```

**Validação:**
- `name`: string, obrigatório
- `email`: string, formato de email válido, obrigatório
- `password`: string, opcional (apenas se quiser alterar a senha)
- `password_confirmation`: string, deve ser igual ao `password` (obrigatório se `password` for fornecido)
- `old_password`: string, obrigatório se `password` for fornecido

**Response Success (200):**
```json
{
  "id": "uuid",
  "name": "Novo Nome",
  "email": "novo@exemplo.com",
  "avatar": "hash-avatar.jpg",
  "avatar_url": "http://localhost:3333/files/hash-avatar.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

---

### 4. Recuperação de Senha (`/password`)

#### POST `/password/forgot`
Solicita a recuperação de senha enviando um token por email.

**Autenticação:** Não requerida  
**Método:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "email": "usuario@exemplo.com"
}
```

**Validação:**
- `email`: string, formato de email válido, obrigatório

**Response Success (204):**
```
No Content
```

#### POST `/password/reset`
Redefine a senha usando o token recebido por email.

**Autenticação:** Não requerida  
**Método:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "token": "token-uuid-recebido-por-email",
  "password": "novaSenha123",
  "password_confirmation": "novaSenha123"
}
```

**Validação:**
- `token`: string, UUID válido, obrigatório
- `password`: string, obrigatório
- `password_confirmation`: string, deve ser igual ao `password`, obrigatório

**Response Success (204):**
```
No Content
```

**Response Error (400):**
```json
{
  "status": "error",
  "message": "User token does not exists."
}
```

---

### 5. Prestadores de Serviços (`/providers`)

#### GET `/providers`
Lista todos os prestadores de serviços disponíveis, excluindo o usuário autenticado.

**Autenticação:** Requerida  
**Método:** GET

**Response Success (200):**
```json
[
  {
    "id": "uuid",
    "name": "Prestador 1",
    "email": "prestador1@exemplo.com",
    "avatar": "hash-avatar.jpg",
    "avatar_url": "http://localhost:3333/files/hash-avatar.jpg",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid",
    "name": "Prestador 2",
    "email": "prestador2@exemplo.com",
    "avatar": null,
    "avatar_url": null,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

#### GET `/providers/:provider_id/month-availability`
Obtém a disponibilidade mensal de um prestador específico.

**Autenticação:** Requerida  
**Método:** GET

**Parâmetros de URL:**
- `provider_id`: UUID do prestador, obrigatório

**Query Parameters:**
- `year`: ano (opcional, padrão: ano atual)
- `month`: mês de 1-12 (opcional, padrão: mês atual)

**Exemplo de URL:** `/providers/uuid-do-prestador/month-availability?year=2023&month=12`

**Response Success (200):**
```json
[
  {
    "day": 1,
    "available": true
  },
  {
    "day": 2,
    "available": false
  },
  ...
  {
    "day": 31,
    "available": true
  }
]
```

#### GET `/providers/:provider_id/day-availability`
Obtém a disponibilidade diária de um prestador específico.

**Autenticação:** Requerida  
**Método:** GET

**Parâmetros de URL:**
- `provider_id`: UUID do prestador, obrigatório

**Query Parameters:**
- `year`: ano (opcional, padrão: ano atual)
- `month`: mês de 1-12 (opcional, padrão: mês atual)  
- `day`: dia do mês (opcional, padrão: dia atual)

**Exemplo de URL:** `/providers/uuid-do-prestador/day-availability?year=2023&month=12&day=15`

**Response Success (200):**
```json
[
  {
    "hour": 8,
    "available": true
  },
  {
    "hour": 9,
    "available": false
  },
  ...
  {
    "hour": 17,
    "available": true
  }
]
```

---

### 6. Agendamentos (`/appointments`)

#### POST `/appointments`
Cria um novo agendamento.

**Autenticação:** Requerida  
**Método:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "provider_id": "uuid-do-prestador",
  "date": "2023-12-15T14:00:00.000Z"
}
```

**Validação:**
- `provider_id`: string, UUID válido, obrigatório
- `date`: data válida, obrigatório

**Response Success (200):**
```json
{
  "id": "uuid",
  "provider_id": "uuid-do-prestador",
  "user_id": "uuid-do-usuario",
  "date": "2023-12-15T14:00:00.000Z",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z",
  "provider": {
    "id": "uuid-do-prestador",
    "name": "Nome do Prestador",
    "email": "prestador@exemplo.com"
  }
}
```

**Response Error (400):**
```json
{
  "status": "error",
  "message": "This appointment is already booked"
}
```

#### GET `/appointments/me`
Lista todos os agendamentos do prestador autenticado para um dia específico.

**Autenticação:** Requerida  
**Método:** GET

**Query Parameters:**
- `day`: dia (formato: 1-31, opcional, padrão: dia atual)
- `month`: mês (formato: 1-12, opcional, padrão: mês atual)
- `year`: ano (formato: YYYY, opcional, padrão: ano atual)

**Exemplo de URL:** `/appointments/me?day=15&month=12&year=2023`

**Response Success (200):**
```json
[
  {
    "id": "uuid",
    "provider_id": "uuid-do-prestador",
    "user_id": "uuid-do-usuario",
    "date": "2023-12-15T14:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "user": {
      "id": "uuid-do-usuario",
      "name": "Nome do Cliente",
      "email": "cliente@exemplo.com"
    }
  }
]
```

---

### 7. Arquivos Estáticos (`/files`)

#### GET `/files/:filename`
Serve arquivos estáticos (avatares, imagens, etc.).

**Autenticação:** Não requerida  
**Método:** GET

**Parâmetros de URL:**
- `filename`: nome do arquivo

**Exemplo de URL:** `/files/hash-avatar.jpg`

**Response Success (200):**
Retorna o arquivo solicitado com o Content-Type apropriado.

**Response Error (404):**
```json
{
  "status": "error",
  "message": "File not found"
}
```

---

## Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Requisição bem-sucedida sem conteúdo de retorno
- **400 Bad Request**: Dados da requisição inválidos
- **401 Unauthorized**: Token de autenticação inválido ou ausente
- **404 Not Found**: Recurso não encontrado
- **429 Too Many Requests**: Muitas requisições (rate limiting)
- **500 Internal Server Error**: Erro interno do servidor

---

## Validações e Regras de Negócio

### Validações Gerais
- Todos os campos obrigatórios devem ser fornecidos
- Emails devem ter formato válido
- UUIDs devem ter formato válido
- Senhas são hasheadas usando bcrypt

### Regras de Agendamento
- Não é possível agendar com o próprio usuário
- Não é possível agendar em horários já ocupados
- Agendamentos só podem ser feitos em horários futuros
- Horários disponíveis: 8h às 17h
- Agendamentos são feitos de hora em hora

### Autenticação
- Tokens JWT têm validade limitada
- Senhas são validadas com hash bcrypt
- Rate limiting aplicado para prevenir ataques

---

## Configuração de Upload

- **Diretório temporário**: `tmp/`
- **Diretório de uploads**: `tmp/uploads/`
- **Naming convention**: `{hash}-{filename}`
- **Storage**: Disco local (configurável para AWS S3)

---

## Middlewares Aplicados

1. **CORS**: Habilitado para todas as rotas
2. **JSON Parser**: Para parsing de request bodies
3. **Rate Limiter**: Limitação de taxa de requisições
4. **Static Files**: Servir arquivos do diretório de uploads
5. **Error Handler**: Tratamento centralizado de erros
6. **Celebrate Validation**: Validação de dados usando Joi

---

## Observações Técnicas

- **Framework**: Express.js
- **Linguagem**: TypeScript
- **ORM**: TypeORM
- **Banco de dados**: PostgreSQL (configurável)
- **Autenticação**: JWT
- **Validação**: Celebrate + Joi
- **Upload**: Multer
- **Cache**: Redis (para sessions)
- **Email**: Nodemailer

Esta documentação cobre todas as rotas disponíveis na API. Para uso adequado, certifique-se de incluir os headers de autenticação apropriados nas rotas protegidas e validar todos os dados de entrada conforme especificado.