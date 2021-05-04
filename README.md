# Crawler em Puppetter

Utilizando as seguintes ferramentas:

- Puppeteer
- node-fetch

## Instalação
Preparação de ambiente da aplicação.
Requisitos:

* node v14+


Com o node em seu ambiente instale as dependências com o seguinte comando no terminal na pasta raiz do projeto em pode-se encontrar o arquivo package.json:
```shell
node install
```

## Como executar o projeto

Vamos executar os comandos abaixo partindo que esteja no diretório raiz onde fez o clone do projeto onde os parametros 'user' e 'password' podem ser substituidos por um usuário e senha válidos.
```sh
node crawler.js user password
```
O crawler começará a executar a raspagem de dados criando um arquivo.json na raiz do projeto com os dados capturados.
