# Documentação da API

Todas as rotas abaixo partem do mesmo host onde o backend está rodando (por padrão `http://localhost:3333`).

> Observação: As rotas marcadas com **(AUTH)** exigem autenticação via JWT. Envie o token no cabeçalho:
>
> ```http
> Authorization: Bearer SEU_JWT_AQUI
> ```

---

## Sumário

1. [Autenticação & Sessões](#autenticacao--sessoes)
2. [Usuários](#usuarios)
3. [Perfil](#perfil)
4. [Recuperação de Senha](#recuperacao-de-senha)
5. [Prestadores](#prestadores)
6. [Agendamentos](#agendamentos)
7. [Arquivos Estáticos](#arquivos-estaticos)

---

## Autenticação & Sessões

### Criar sessão (login)

| Método | Rota | Autenticação |
| ------ | ---- | ------------ |
| `POST` | `/sessions` | não |

**Body (JSON)**

```json
{
  "email": "usuario@email.com",
  "password": "sua_senha"
}
```

**Resposta 200**

```json
{
  "user": {
    "id": "uuid",
    "name": "Usuário",
    "email": "usuario@email.com",
    "avatar_url": "http://localhost:3333/files/arquivo.png",
    ...
  },
  "token": "jwt-token"
}
```

---

## Usuários

### Criar usuário (registro)

| Método | Rota | Autenticação |
| ------ | ---- | ------------ |
| `POST` | `/users` | não |

**Body (JSON)**

```json
{
  "name": "Usuário",
  "email": "usuario@email.com",
  "password": "sua_senha"
}
```

**Resposta 200** – Objeto do usuário (sem o campo `password`).

---

### Atualizar avatar **(AUTH)**

| Método | Rota | Autenticação |
| ------ | ---- | ------------ |
| `PATCH` | `/users/avatar` | sim |

**Headers**

```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Body (form-data)**

| Campo | Tipo | Obrigatório | Descrição |
| ----- | ---- | ---------- | --------- |
| `avatar` | File | Sim | Imagem do avatar.

**Resposta 200** – Objeto do usuário com campo `avatar` atualizado.

---

## Perfil

Todas as rotas de perfil exigem autenticação **(AUTH)**.

### Obter dados do perfil

| Método | Rota |
| ------ | ---- |
| `GET` | `/profile` |

**Resposta 200** – Objeto do usuário.

---

### Atualizar perfil

| Método | Rota |
| ------ | ---- |
| `PUT` | `/profile` |

**Body (JSON)**

```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "old_password": "senha_atual",   // opcional (requerido se "password" for enviado)
  "password": "nova_senha",        // opcional
  "password_confirmation": "nova_senha" // deve coincidir com "password"
}
```

**Resposta 200** – Objeto do usuário atualizado.

---

## Recuperação de Senha

### Solicitar e-mail de recuperação

| Método | Rota | Autenticação |
| ------ | ---- | ------------ |
| `POST` | `/password/forgot` | não |

**Body (JSON)**

```json
{
  "email": "usuario@email.com"
}
```

**Resposta 204** – Sem conteúdo.

---

### Resetar senha

| Método | Rota | Autenticação |
| ------ | ---- | ------------ |
| `POST` | `/password/reset` | não |

**Body (JSON)**

```json
{
  "token": "uuid-token-recebido-por-email",
  "password": "nova_senha",
  "password_confirmation": "nova_senha"
}
```

**Resposta 204** – Sem conteúdo.

---

## Prestadores

Todas as rotas de prestadores exigem autenticação **(AUTH)**.

### Listar prestadores de serviço

| Método | Rota |
| ------ | ---- |
| `GET` | `/providers` |

**Resposta 200** – Array de usuários prestadores.

---

### Disponibilidade mensal de um prestador

| Método | Rota |
| ------ | ---- |
| `GET` | `/providers/{provider_id}/month-availability` |

**Parâmetros de Rota**

| Nome | Tipo |
| ---- | ---- |
| `provider_id` | UUID |

**Query params**

| Nome | Tipo | Obrigatório |
| ---- | ---- | ---------- |
| `month` | number (1-12) | Sim |
| `year`  | number (YYYY) | Sim |

---

### Disponibilidade diária de um prestador

| Método | Rota |
| ------ | ---- |
| `GET` | `/providers/{provider_id}/day-availability` |

**Parâmetros de Rota**

| Nome | Tipo |
| ---- | ---- |
| `provider_id` | UUID |

**Query params**

| Nome | Tipo | Obrigatório |
| ---- | ---- | ---------- |
| `day`   | number (1-31) | Sim |
| `month` | number (1-12) | Sim |
| `year`  | number (YYYY) | Sim |

**Resposta 200** – Lista de horários e disponibilidade booleana.

---

## Agendamentos

Todas as rotas de agendamento exigem autenticação **(AUTH)**.

### Criar agendamento

| Método | Rota |
| ------ | ---- |
| `POST` | `/appointments` |

**Body (JSON)**

```json
{
  "provider_id": "uuid-do-prestador",
  "date": "2023-12-31T15:00:00Z" // ISO 8601
}
```

**Resposta 200** – Objeto do agendamento criado.

---

### Listar agendamentos do prestador logado em um dia

| Método | Rota |
| ------ | ---- |
| `GET` | `/appointments/me` |

**Query params**

| Nome | Tipo | Obrigatório |
| ---- | ---- | ---------- |
| `day`   | number (1-31) | Sim |
| `month` | number (1-12) | Sim |
| `year`  | number (YYYY) | Sim |

**Resposta 200** – Array de agendamentos do prestador.

---

## Arquivos Estáticos

### Baixar/exibir arquivo

| Método | Rota | Autenticação |
| ------ | ---- | ------------ |
| `GET` | `/files/{filename}` | não |

Retorna o arquivo de imagem salvo no diretório de uploads (útil para exibir avatars, por exemplo).

---

## Convenções de Erro

Sempre que ocorrer um erro controlado, o backend responde com:

```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

Códigos de status mais comuns:

* `400` – Requisição inválida/validação
* `401` – Não autorizado (token ausente ou inválido)
* `404` – Recurso não encontrado
* `500` – Erro interno do servidor