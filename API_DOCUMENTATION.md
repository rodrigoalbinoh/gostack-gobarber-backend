# Documentação da API - Sistema de Agendamentos

## Visão Geral

Esta API é um sistema de agendamentos desenvolvido em Node.js com TypeScript, Express e TypeORM. O sistema permite gerenciar usuários, prestadores de serviços, agendamentos e autenticação.

**Base URL**: `http://localhost:3333`

## Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Após o login, o token deve ser incluído no header `Authorization` como `Bearer token`.

```http
Authorization: Bearer <seu_jwt_token>
```

### Rotas que requerem autenticação:
- Todas as rotas de `/appointments`
- Todas as rotas de `/providers`
- Todas as rotas de `/profile`
- `PATCH /users/avatar`

## Middleware de Rate Limiting

A API possui rate limiting implementado para prevenir abuso. Limite padrão aplicado a todas as rotas.

## Upload de Arquivos

Arquivos estáticos são servidos em `/files/` e podem ser armazenados localmente ou no Amazon S3, dependendo da configuração da variável `STORAGE_DRIVER`.

---

## 🔐 Autenticação e Sessões

### POST /sessions
Realiza login do usuário e retorna token JWT.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "avatar": "avatar_filename.jpg",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_aqui"
}
```

**Validação:**
- `email`: string, formato de email válido, obrigatório
- `password`: string, obrigatório

---

## 👤 Usuários

### POST /users
Cria um novo usuário no sistema.

**Request Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "avatar": null,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**Validação:**
- `name`: string, obrigatório
- `email`: string, formato de email válido, obrigatório
- `password`: string, obrigatório

### PATCH /users/avatar
Atualiza o avatar do usuário autenticado.

**🔒 Requer Autenticação**

**Request:**
- Método: `multipart/form-data`
- Campo: `avatar` (arquivo de imagem)

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "avatar": "novo_avatar_filename.jpg",
  "avatar_url": "http://localhost:3333/files/novo_avatar_filename.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

---

## 👤 Perfil do Usuário

### GET /profile
Retorna informações do perfil do usuário autenticado.

**🔒 Requer Autenticação**

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "avatar": "avatar_filename.jpg",
  "avatar_url": "http://localhost:3333/files/avatar_filename.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

### PUT /profile
Atualiza informações do perfil do usuário autenticado.

**🔒 Requer Autenticação**

**Request Body:**
```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "old_password": "senha_atual",
  "password": "nova_senha",
  "password_confirmation": "nova_senha"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Novo Nome",
  "email": "novo@email.com",
  "avatar": "avatar_filename.jpg",
  "avatar_url": "http://localhost:3333/files/avatar_filename.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**Validação:**
- `name`: string, obrigatório
- `email`: string, formato de email válido, obrigatório
- `password`: string, opcional
- `password_confirmation`: string, deve ser igual ao `password`
- `old_password`: string, opcional

**Regras:**
- Se `password` for fornecido, `old_password` é obrigatório
- `password_confirmation` deve ser igual a `password`

---

## 🔑 Recuperação de Senha

### POST /password/forgot
Solicita recuperação de senha. Envia email com token de reset.

**Request Body:**
```json
{
  "email": "usuario@email.com"
}
```

**Response (204):** Sem conteúdo

**Validação:**
- `email`: string, formato de email válido, obrigatório

### POST /password/reset
Redefine a senha usando token recebido por email.

**Request Body:**
```json
{
  "token": "token_uuid_recebido_por_email",
  "password": "nova_senha",
  "password_confirmation": "nova_senha"
}
```

**Response (204):** Sem conteúdo

**Validação:**
- `token`: string, formato UUID, obrigatório
- `password`: string, obrigatório
- `password_confirmation`: string, deve ser igual ao `password`, obrigatório

---

## 🏥 Prestadores de Serviços

### GET /providers
Lista todos os prestadores de serviços (exceto o usuário atual).

**🔒 Requer Autenticação**

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Nome do Prestador",
    "email": "prestador@email.com",
    "avatar": "avatar_filename.jpg",
    "avatar_url": "http://localhost:3333/files/avatar_filename.jpg",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

### GET /providers/:provider_id/month-availability
Retorna disponibilidade do prestador por mês.

**🔒 Requer Autenticação**

**Parâmetros da URL:**
- `provider_id`: UUID do prestador

**Query Parameters:**
- `month`: número do mês (1-12)
- `year`: ano (ex: 2023)

**Response (200):**
```json
[
  {
    "day": 1,
    "available": true
  },
  {
    "day": 2,
    "available": false
  }
]
```

**Validação:**
- `provider_id`: string, formato UUID, obrigatório

### GET /providers/:provider_id/day-availability
Retorna disponibilidade do prestador por dia.

**🔒 Requer Autenticação**

**Parâmetros da URL:**
- `provider_id`: UUID do prestador

**Query Parameters:**
- `day`: dia do mês (1-31)
- `month`: número do mês (1-12)
- `year`: ano (ex: 2023)

**Response (200):**
```json
[
  {
    "hour": 8,
    "available": true
  },
  {
    "hour": 9,
    "available": false
  }
]
```

**Validação:**
- `provider_id`: string, formato UUID, obrigatório

---

## 📅 Agendamentos

### POST /appointments
Cria um novo agendamento.

**🔒 Requer Autenticação**

**Request Body:**
```json
{
  "provider_id": "uuid_do_prestador",
  "date": "2023-12-25T10:00:00.000Z"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "provider_id": "uuid_do_prestador",
  "user_id": "uuid_do_usuario",
  "date": "2023-12-25T10:00:00.000Z",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**Validação:**
- `provider_id`: string, formato UUID, obrigatório
- `date`: data/hora válida, obrigatório

**Regras de Negócio:**
- Agendamento deve ser em horário futuro
- Horário deve estar disponível
- Usuário não pode agendar consigo mesmo

### GET /appointments/me
Lista agendamentos do prestador autenticado.

**🔒 Requer Autenticação**

**Query Parameters:**
- `day`: dia do mês (1-31)
- `month`: número do mês (1-12)
- `year`: ano (ex: 2023)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "provider_id": "uuid_do_prestador",
    "user_id": "uuid_do_usuario",
    "date": "2023-12-25T10:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "name": "Nome do Cliente",
      "avatar": "avatar_filename.jpg",
      "avatar_url": "http://localhost:3333/files/avatar_filename.jpg"
    }
  }
]
```

---

## 📁 Arquivos Estáticos

### GET /files/:filename
Acessa arquivos estáticos (avatares, etc.).

**Exemplo:**
```
GET http://localhost:3333/files/avatar-123456.jpg
```

---

## 🚨 Códigos de Erro

### Estrutura de Resposta de Erro
```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

### Códigos HTTP Utilizados:
- **200**: Sucesso
- **204**: Sucesso sem conteúdo
- **400**: Erro de validação ou regra de negócio
- **401**: Não autorizado (token inválido/ausente)
- **404**: Recurso não encontrado
- **429**: Muitas requisições (rate limit)
- **500**: Erro interno do servidor

### Exemplos de Erros Comuns:

**Token Inválido (401):**
```json
{
  "status": "error",
  "message": "JWT token is missing"
}
```

**Erro de Validação (400):**
```json
{
  "status": "error",
  "message": "\"email\" must be a valid email"
}
```

**Usuário já existe (400):**
```json
{
  "status": "error",
  "message": "Email address already used"
}
```

---

## 🔧 Configuração e Middleware

### Rate Limiting
- Implementado em todas as rotas
- Baseado na biblioteca `rate-limiter-flexible`

### CORS
- Habilitado para todas as origens

### Validação
- Utiliza `celebrate` (Joi) para validação de dados
- Validação automática de parâmetros, query strings e body

### Upload de Arquivos
- Suporte a armazenamento local e Amazon S3
- Configurável via variável de ambiente `STORAGE_DRIVER`
- Arquivos são renomeados com hash para evitar conflitos

### Transformação de Dados
- Utiliza `class-transformer` para serialização
- Campos sensíveis como `password` são automaticamente excluídos

---

## 📝 Notas Importantes

1. **Timezone**: Todas as datas são retornadas em UTC
2. **Formato de Data**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)
3. **UUIDs**: Todos os IDs são UUIDs v4
4. **Senhas**: Automaticamente criptografadas com bcrypt
5. **Tokens JWT**: Incluem informações do usuário e expiração
6. **Emails**: Sistema de envio configurado (requer configuração SMTP)

---

## 🧪 Exemplos de Uso

### Fluxo Completo de Autenticação:
```bash
# 1. Criar usuário
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@email.com", "password": "123456"}'

# 2. Fazer login
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "123456"}'

# 3. Usar token para acessar perfil
curl -X GET http://localhost:3333/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar um Agendamento:
```bash
curl -X POST http://localhost:3333/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"provider_id": "uuid-do-prestador", "date": "2023-12-25T10:00:00.000Z"}'
```