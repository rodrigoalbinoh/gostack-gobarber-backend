# GoBarber
![GitHub last commit](https://img.shields.io/github/last-commit/rodrigoalbinoh/gostack-gobarber-backend)

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rodrigoalbinoh/gostack-gobarber-backend)

## Criando os containers no Docker
Basta rodar os comandos abaixo no seu terminal

docker run --name gostack_postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
docker run --name gostack_mongo -p 27017:27017 -d -t mongo
docker run --name gostack_redis -p 6379:6379 -d -t redis:alpine

* Quando reiniciar a máquina ou o container parar, basta rodar: docker ps -a
* Identificar o container parado e rodar: docker start {container_id ou name}


# Recuperação de Senha
**RF**
- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**
- Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**
- O link enviado por e-mail para resetar senha deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;


# Atualização do Perfil
**RF**
- O usuário deve poder atualizar seu nome, e-mail e senha;

**RN**
- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário deve confirmar a nova senha;

# Painel do Prestador
**RF**
- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber um notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**
- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;


**RN**
- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

# Agendamento de Serviços

**RF**
- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com com pelo menos 1 horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve pode realizar um novo agendamento com um prestador;

**RNF**
- A listagem de prestadores deve ser armazenada em cache;

**RN**
- Cada agendamento deve durar uma hora exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;
