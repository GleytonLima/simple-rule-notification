[![Node.js CI](https://github.com/GleytonLima/simple-rule-notification/actions/workflows/node.js.yml/badge.svg)](https://github.com/GleytonLima/simple-rule-notification/actions/workflows/node.js.yml) [![Coverage Status](https://coveralls.io/repos/github/GleytonLima/simple-rule-notification/badge.svg?branch=main)](https://coveralls.io/github/GleytonLima/simple-rule-notification?branch=main) [![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2FGleytonLima%2Fsimple-rule-notification%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/GleytonLima/simple-rule-notification/main)

# Simple Rule Notification

Interpret some simples rules in json to generate notifications

# About The Project

A way for persist some configurable rules for use in some data in frontend.

## Usage

Install the package from npm:

```
npm i simple-rule-notification
```

Import the package:

```js
const srn = require("simple-rule-notification");
```

Retrieve the following rules from backend:

```js
const operacaoGrupo = {
    id: 1,
    acaoEnum: "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO",
    operacaoRaiz: {
        id: 2,
        nomeCampo: "ocorrencia",
        comparadorEnum: "IGUAL",
        valor: "valor_esperado",
        proximaOperacao: null,
        operadorProximaOperacao: null,
    },
    tituloPadrao: "OcorrĂȘncia no Campo",
    mensagemPadrao: "O campo ocorrĂȘncia foi preenchido.",
    tipoMensagem: "INFO",
    quantidadeDiasEntreDatasChave: null,
    respostasPadrao: null,
};
```

Then build a strategy and execute it, passing the data:

```js
const data = {
    respostas: {
        ocorrencia: "valor_esperado",
    },
};
const applicableRule = srn.buildAcaoStrategy(operacaoGrupo, data).executar();
```

In this case the return will be:

```json
{ "tipo": "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO" }
```

If the entry has the following value:

```js
const data = {
    respostas: {
        ocorrencia: "valor_nao_esperado",
    },
};
```

The return will be:

```js
null;
```

## Unit tests - Jest

```
npm test
```

```
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |
 functions.ts |     100 |      100 |     100 |     100 |
 index.ts     |     100 |      100 |     100 |     100 |
--------------|---------|----------|---------|---------|-------------------
```

## Mutation Test - Striker

```
npx stryker run
```

```
--------------|---------|----------|-----------|------------|----------|---------|
File          | % score | # killed | # timeout | # survived | # no cov | # error |
--------------|---------|----------|-----------|------------|----------|---------|
All files     |  100.00 |      101 |         0 |          0 |        0 |       8 |
 functions.ts |  100.00 |      101 |         0 |          0 |        0 |       8 |
--------------|---------|----------|-----------|------------|----------|---------|
```
