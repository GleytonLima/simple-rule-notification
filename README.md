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
    tituloPadrao: "Ocorrência no Campo",
    mensagemPadrao: "O campo ocorrência foi preenchido.",
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
