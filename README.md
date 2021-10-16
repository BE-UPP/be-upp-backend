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
com um body qualquer




get 'http://dominio.com/template'
get vai ser responsavel por levar os dados do banco até frontend
deve o json do questionario

get da versão mais nova

post 'http://dominio.com/template'
Cadastrar uma nova versão do template

post 'http://dominio.com/form-data'
salvar os dados poós preenchimento do formulário


senna
Joannis
marcos
luciano
lawand
leo

Criar estrutura de pastas 2 marcos luciano
Criar arquivos middlewares de rotas 2 lawand joannis
Parametrizar acesso do banco de dados passar para .env 2 leo senna

Criar api post template 3 lawand marcos luciano
criar api get template 3 joannis senna leo

criar api post form data

para mudar de branch

git checkout "nomedabrach"

para mudar e criar uma branch ao mesmo tempo

git checkout -b "nome"

