# Trabalho Redis MegaSena

Trabalho feito em node.JS, gerando resultados aleatórios de 6 números entre 1 e 60 com 0 a 20 ganhadores para cada quarta e sábado desde 10 de outubro de 1999.

## Como rodar
Clone o repositório e execute os comandos abaixo para configurar o projeto:
```bash
  npm init -y
  npm i redis readline
```

Em seguida confira o arquivo ```config.json``` e altere o endereço e porta do servidor do Redis caso necessário.

Agora basta executar com o comando ```node index.js```.
