# GoBarber
![GitHub last commit](https://img.shields.io/github/last-commit/rodrigoalbinoh/gostack-gobarber-backend)

![GitHub commit activity](https://img.shields.io/github/commit-activity/w/rodrigoalbinoh/gostack-gobarber-backend)

## Criando os containers no Docker
Basta rodar os comandos abaixo no seu terminal

docker run --name gostack_postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

* Quando reiniciar a máquina ou o container parar, basta rodar: docker ps -a
* Identificar o container parado e rodar: docker start [container_id ou name]
