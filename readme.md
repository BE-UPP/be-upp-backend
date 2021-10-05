Para rodar o esqueleto do backend

Instale o docker 

Abaixo segue um tutorial
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt


após o docker instaldado entre na pasta dockers-dev e execute a 
imagem que contem o banco de dados de desenvolvimento com o comando:

docker-compose -f bancodados.yml up

o terminal vai ficar sempre soltando consoles enquanto o banco de dados estiver rodando

após esse comando parar de soltar mensagens execute o mongoexpress, o que vai ser uma interface muito útil 
para lidarmos com o banco. 

na mesma pasta com outra aba do terminal execute o comando:

docker-compose -f mongoexpress.yml up

apoós esse comando startar o mongo express estara disponível em: 

http://0.0.0.0:8081/

as senhas de login encontrasse dentro do YML em:

ME_CONFIG_BASICAUTH_USERNAME: beeUp
ME_CONFIG_BASICAUTH_PASSWORD: beeUpPass

nessa aplicação podera acompanhar o banco de dados em tempo real. 

bom, agora com o banco rodando podemos rodar o back-end. 

instale os pacotes dependentes

Rode npm install

Rode npm run start:dev

faça um post atravez do insomnia ou postman para a url: 
http://localhost:3000/
com um body qualquer

