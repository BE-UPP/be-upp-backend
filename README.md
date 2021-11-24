# be-upp

## Preparar o ambiente

#### Ferramentas necessárias

- [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt)
- [docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
- [npm](https://docs.npmjs.com/)

#### Variáveis de ambiente
Crie o arquivo **.env** e defina as variávesi de ambiente. Utilize como referência o arquivo **.env-example**
```bash
cp .env-example .env
```

## Como rodar 
#### Inicializar containers (mongo e mongo-express) e API
``` bash
./run-be-upp.sh
```

#### Consultar registros (opcional)
A interface web do mongo-express estará disponível em **http://0.0.0.0:8081/**
Nesta interface web é possível acompanhar os dados do banco de dados em tempo real.

Os dados de acesso são os configurados no arquivo **.env**:
``` 
ME_CONFIG_BASICAUTH_USERNAME: 
ME_CONFIG_BASICAUTH_PASSWORD: 
```

#### Testar API

Faça um post na url:
``` bash
http://localhost:3000/
com um body qualquer

get 'http://dominio.com/template'

post 'http://dominio.com/template'

post 'http://dominio.com/form-data'
```
