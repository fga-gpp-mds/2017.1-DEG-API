# Fórum DEG RESTful API

[![Heroku](http://heroku-badge.herokuapp.com/?app=angularjs-crypto&style=flat&svg=1&root=index.html)](https://forumdeg.herokuapp.com)

Contruido em `Nodejs` e `RethinkDB`.

## Rotas

* `/api` - Rota principal da aplicação
  * [`/coordinators`](#Coordinators) - Rota de acesso para os coordenadores


## Relacionamentos
* Coordenador - Forum ( N x M )
  * [`/coordinators/:matricula/forums/:forumId`](#Coordinators-Forum-(Relacionamento-NxM))

### Coordinators

Aceita os métodos de `GET`, `POST`, `UPDATE`, `DELETE`.

URL de acesso: `api/coordinators`

#### GET
* **All:**   
URL Genérica `/api/coordinators`

##### Resposta
```json
[{
  "registration": "1234567",
  "name": "José Silva",
  "password": "123456aA",
  "email": "a@a.com",
  "course": "Engenharia de Software"
}, {}, ...]
```
* **Single:**    
URL Genérica `/api/coordinators/:registration`    
Exemplo de uso `/api/coordinators/130123456`

##### Resposta
```json
{
  "registration": "1234567",
  "name": "José Silva",
  "password": "123456aA",
  "email": "a@a.com",
  "course": "Engenharia de Software"
}
```


#### POST

Acionado via request body.   
URL Genérica `/api/coordinators`   
Exemplo de request:

Exemplo Body:
```json
{
	"coordinator": {
		"registration": "1234567",
		"name": "José Silva",
		"password": "123456aA",
		"email": "a@a.com",
		"course": "Engenharia de Software"
	}
}
```

##### Resposta
* Positiva:
```json
{
  "result": {
    "registration": "123456789",
    "name": "José Silva",
    "password": "123456aA",
    "email": "a@a.com",
    "course": "Engenharia de Software"
  },
  "success": true
}
```

* Negativa:

```json
{
  "error": "Mensagem Error",
  "success": false
}
```

#### UPDATE (PUT)
Acionado via request body.   

URL Genérica `/api/coordinators/:registration`   
Exemplo de uso `/api/coordinators/130123456`

Exemplo Body:
```json
// Necessita apenas dos parâmetros a serem modificados
// Podendo omitir alguns que não serão modificados
{
	"coordinator": {
		"name": "João Silva"
	}
}
```

##### Resposta
* Positiva
```json
{
  "result": {
    "registration": "123456789",
    "name": "João Silva",
    "password": "123456aA",
    "email": "a@a.com",
    "course": "Engenharia de Software"
  },
  "old": {
    "registration": "123456789",
    "name": "José Silva",
    "password": "123456aA",
    "email": "a@a.com",
    "course": "Engenharia de Software"
  },
  "success": true
}
```

* Negativa:

```json
{
  "error": "Mensagem Error",
  "success": false
}
```
#### DELETE
URL Genérica `/api/coordinators/:registration`   
Exemplo de uso `/api/coordinators/130123456`

##### Resposta
* Positiva:
```json
{
  "result": {
    "registration": "123456789",
    "name": "José Silva",
    "password": "123456aA",
    "email": "a@a.com",
    "course": "Engenharia de Software"
  },
  "success": true
}
```

* Negativa:

```json
{
  "error": "Mensagem Error",
  "success": false
}
```

### Coordinators_Forum (Relacionamento NxM)

URL Genérica `/coordinators/:matricula/forums/:forumId`   
Exemplo de uso `/coordinators/124567234/forums/a183be7e-b4d2-4a42-bdcf-bf6ad4b0d8fe`    

#### Aceita os métodos de `GET`, `POST`, `DELETE`

#### GET (Se um usuário está confirmado em um Forum)
##### Resposta
* Positiva:
```json
{
  "success": true
}
```
* Negativa:
```json
{
  "success": false
}
```

#### POST (Confirma presença do coordenador)
##### Resposta
* Positiva:
```json
{
  "success": true
}
```
* Negativa:
```json
{
  "success": false
}
```

#### DELETE (Cancela presença do coordenador)
##### Resposta
* Positiva:
```json
{
  "success": true
}
```
* Negativa:
```json
{
  "success": false
}
```
