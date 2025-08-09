## API Reference

- Base URL: `http://localhost:3333`
- Content type: `application/json` (exceto upload de avatar)
- Autenticação: JWT via header `Authorization: Bearer <token>` nas rotas protegidas
- Arquivos estáticos: `GET /files/:filename`
- Rate limiting: 5 requisições/segundo por IP (HTTP 429 se exceder)

### Erros
- Validações (Celebrate/Joi): HTTP 400 com detalhes de validação
- AppError (negócio): HTTP 4xx com body `{ status: "error", message: string }`
- Erro interno: HTTP 500 `{ status: "error", message: "Internal Server Error" }`

---

## Autenticação

### POST /sessions
Autentica o usuário e retorna um token JWT.

- Auth: pública
- Body (JSON):
  - `email` (string, email, obrigatório)
  - `password` (string, obrigatório)
- Respostas:
  - 200 OK:
    ```json
    {
      "user": {
        "id": "uuid",
        "name": "string",
        "email": "string",
        "avatar": "string|null",
        "avatar_url": "string|null",
        "created_at": "ISO8601",
        "updated_at": "ISO8601"
      },
      "token": "jwt-string"
    }
    ```

Exemplo cURL:
```bash
curl -X POST http://localhost:3333/sessions \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'
```

---

## Usuários

### POST /users
Cria um novo usuário.

- Auth: pública
- Body (JSON):
  - `name` (string, obrigatório)
  - `email` (string, email, obrigatório)
  - `password` (string, obrigatório)
- Respostas:
  - 200 OK: usuário criado (sem `password`), com `avatar_url` calculado

Exemplo cURL:
```bash
curl -X POST http://localhost:3333/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret"}'
```

### PATCH /users/avatar
Atualiza o avatar do usuário (upload de arquivo).

- Auth: Bearer token
- Content-Type: `multipart/form-data`
- Form fields:
  - `avatar` (file, obrigatório)
- Respostas:
  - 200 OK: usuário atualizado com `avatar_url`

Exemplo cURL:
```bash
curl -X PATCH http://localhost:3333/users/avatar \
  -H 'Authorization: Bearer <TOKEN>' \
  -F 'avatar=@/caminho/para/arquivo.jpg'
```

---

## Perfil

### GET /profile
Retorna o perfil do usuário autenticado.

- Auth: Bearer token
- Respostas:
  - 200 OK: usuário (sem `password`), com `avatar_url`

Exemplo cURL:
```bash
curl -X GET http://localhost:3333/profile \
  -H 'Authorization: Bearer <TOKEN>'
```

### PUT /profile
Atualiza dados do perfil do usuário autenticado.

- Auth: Bearer token
- Body (JSON):
  - `name` (string, obrigatório)
  - `email` (string, email, obrigatório)
  - `password` (string, opcional)
  - `password_confirmation` (string, deve ser igual a `password` quando `password` for enviado)
  - `old_password` (string, requerido pelo domínio quando `password` for enviado)
- Respostas:
  - 200 OK: usuário atualizado

Exemplo cURL:
```bash
curl -X PUT http://localhost:3333/profile \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Jane Changed",
    "email": "jane.changed@example.com",
    "old_password": "secret",
    "password": "new-secret",
    "password_confirmation": "new-secret"
  }'
```

---

## Senha

### POST /password/forgot
Dispara e-mail de recuperação de senha.

- Auth: pública
- Body (JSON):
  - `email` (string, email, obrigatório)
- Respostas:
  - 204 No Content

Exemplo cURL:
```bash
curl -X POST http://localhost:3333/password/forgot \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com"}'
```

### POST /password/reset
Redefine a senha com um token válido.

- Auth: pública
- Body (JSON):
  - `token` (string, uuid, obrigatório)
  - `password` (string, obrigatório)
  - `password_confirmation` (string, obrigatório, igual a `password`)
- Respostas:
  - 204 No Content

Exemplo cURL:
```bash
curl -X POST http://localhost:3333/password/reset \
  -H 'Content-Type: application/json' \
  -d '{"token":"uuid-token","password":"new-pass","password_confirmation":"new-pass"}'
```

---

## Prestadores (Providers)

### GET /providers
Lista prestadores disponíveis (usuários) para atendimento.

- Auth: Bearer token
- Respostas:
  - 200 OK: array de usuários (sem `password`, com `avatar_url`)

Exemplo cURL:
```bash
curl -X GET http://localhost:3333/providers \
  -H 'Authorization: Bearer <TOKEN>'
```

### GET /providers/:provider_id/month-availability
Disponibilidade mensal do prestador.

- Auth: Bearer token
- Params:
  - `provider_id` (string, uuid, obrigatório)
- Query:
  - `month` (number, obrigatório)
  - `year` (number, obrigatório)
- Respostas:
  - 200 OK:
    ```json
    [
      { "day": 1, "available": true },
      { "day": 2, "available": false }
    ]
    ```

Exemplo cURL:
```bash
curl -X GET 'http://localhost:3333/providers/<PROVIDER_ID>/month-availability?month=12&year=2025' \
  -H 'Authorization: Bearer <TOKEN>'
```

### GET /providers/:provider_id/day-availability
Disponibilidade diária do prestador por hora.

- Auth: Bearer token
- Params:
  - `provider_id` (string, uuid, obrigatório)
- Query:
  - `day` (number, obrigatório)
  - `month` (number, obrigatório)
  - `year` (number, obrigatório)
- Respostas:
  - 200 OK:
    ```json
    [
      { "hour": 8, "available": true },
      { "hour": 9, "available": false }
    ]
    ```

Exemplo cURL:
```bash
curl -X GET 'http://localhost:3333/providers/<PROVIDER_ID>/day-availability?day=10&month=12&year=2025' \
  -H 'Authorization: Bearer <TOKEN>'
```

---

## Agendamentos (Appointments)

### POST /appointments
Cria um agendamento para um prestador.

- Auth: Bearer token
- Body (JSON):
  - `provider_id` (string, uuid, obrigatório)
  - `date` (date, obrigatório; ISO 8601 recomendado)
- Respostas:
  - 200 OK:
    ```json
    {
      "id": "uuid",
      "provider_id": "uuid",
      "user_id": "uuid",
      "date": "ISO8601",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
    ```

Exemplo cURL:
```bash
curl -X POST http://localhost:3333/appointments \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"provider_id":"<PROVIDER_ID>","date":"2025-12-10T13:00:00.000Z"}'
```

### GET /appointments/me
Lista agendamentos do prestador autenticado para um dia.

- Auth: Bearer token (o usuário autenticado é tratado como prestador nesta rota)
- Query:
  - `day` (number, obrigatório)
  - `month` (number, obrigatório)
  - `year` (number, obrigatório)
- Respostas:
  - 200 OK: array de agendamentos. Cada item pode incluir o objeto `user` do cliente:
    ```json
    [
      {
        "id": "uuid",
        "provider_id": "uuid",
        "user_id": "uuid",
        "date": "ISO8601",
        "created_at": "ISO8601",
        "updated_at": "ISO8601",
        "user": {
          "id": "uuid",
          "name": "string",
          "email": "string",
          "avatar": "string|null",
          "avatar_url": "string|null",
          "created_at": "ISO8601",
          "updated_at": "ISO8601"
        }
      }
    ]
    ```

Exemplo cURL:
```bash
curl -X GET 'http://localhost:3333/appointments/me?day=10&month=12&year=2025' \
  -H 'Authorization: Bearer <TOKEN>'
```

---

## Arquivos

### GET /files/:filename
Serve arquivos estáticos (ex.: avatars) enviados via upload.

- Auth: pública
- Respostas:
  - 200 OK: conteúdo do arquivo
  - 404 Not Found: arquivo inexistente

Exemplo cURL:
```bash
curl -X GET http://localhost:3333/files/abcdef-avatar.jpg --output avatar.jpg
```

---

## Esquemas de validação (resumo)

- Sessions POST `/sessions` (body):
  - `email`: string.email().required()
  - `password`: string().required()
- Users POST `/users` (body):
  - `name`: string().required()
  - `email`: string.email().required()
  - `password`: string().required()
- Password POST `/password/forgot` (body):
  - `email`: string.email().required()
- Password POST `/password/reset` (body):
  - `token`: string().uuid().required()
  - `password`: string().required()
  - `password_confirmation`: string().valid(Joi.ref('password')).required()
- Profile PUT `/profile` (body):
  - `name`: string().required()
  - `email`: string.email().required()
  - `password`: string()
  - `password_confirmation`: string().valid(Joi.ref('password'))
  - `old_password`: string()
- Appointments POST `/appointments` (body):
  - `provider_id`: string().uuid().required()
  - `date`: date()
- Providers GET `/:provider_id/month-availability` (params):
  - `provider_id`: string().uuid().required()
- Providers GET `/:provider_id/day-availability` (params):
  - `provider_id`: string().uuid().required()

---

## Notas
- `avatar_url` depende de `APP_API_URL` quando o storage é `disk`. Para `s3`, a URL aponta para o bucket configurado.
- Algumas regras de domínio (ex.: exigência de `old_password` ao alterar senha) são aplicadas nos services e podem gerar HTTP 400/401 com mensagem de erro quando violadas.
- Todas as rotas protegidas exigem `Authorization: Bearer <token>` válido; caso contrário, retornam HTTP 401.