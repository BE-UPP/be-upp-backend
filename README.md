## Ferramentas necessárias

- [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt)
- [docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
- [npm](https://docs.npmjs.com/)
 
## Como rodar 
#### 1. Inicialize o banco de dados
``` bash
docker-compose up mongo 
```


#### 2. Inicialize o mongo-express

Após o mongo terminar de inicializar, inicialize o mongo-express:
``` bash
docker-compose up mongo-express 
```

##### 2.1 Acesso ao mongo-express

Após a inicialização do mongo-express, ele estará disponível em: 
``` bash
http://0.0.0.0:8081/
```
As senhas de login encontram-se dentro do docker-compose.yml em:

ME_CONFIG_BASICAUTH_USERNAME: beeUp 

ME_CONFIG_BASICAUTH_PASSWORD: beeUpPass

Com essa aplicação é possível acompanhar o banco de dados em tempo real.

#### 3. Inicializando o backend


##### 3.1 Instale os pacotes dependentes
``` bash
npm install
```

##### 3.2 Inicialize o servidor
``` bash
npm run start:dev
```

#### 4. Teste

Faça um post na url:
``` bash
http://localhost:3000/
```
