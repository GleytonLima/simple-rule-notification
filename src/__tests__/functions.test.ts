import {
    buildAcaoStrategy,
    executarOperacaoAtual,
    extrairValorResposta,
    Operacao,
    OperacaoGrupo,
    possuiRespostasComValorEsperado,
} from "..";

const operacoesGruposSimples = [
    {
        id: 71423,
        acaoEnum: "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO",
        operacaoRaiz: {
            id: 71424,
            nomeCampo: "ocorrencia",
            comparadorEnum: "NAO_NULO",
            valorInicial: null,
            valorFinal: null,
            valor: "",
            valores: [],
            proximaOperacao: null,
            operadorProximaOperacao: null,
        },
        tituloPadrao: "Ocorrência no Campo",
        mensagemPadrao: "O campo ocorrência foi preenchido.",
        tipoMensagem: "INFO",
        quantidadeDiasEntreDatasChave: null,
        respostasPadrao: null,
    },
];

const operacoesGruposEncadeadoAnd = [
    {
        id: 71423,
        acaoEnum: "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO",
        operacaoRaiz: {
            id: 71424,
            nomeCampo: "ocorrencia",
            comparadorEnum: "NAO_NULO",
            valorInicial: null,
            valorFinal: null,
            valor: "",
            valores: [],
            proximaOperacao: {
                id: 71425,
                nomeCampo: "nome",
                comparadorEnum: "NAO_NULO",
                valorInicial: null,
                valorFinal: null,
                valor: "",
                valores: [],
                proximaOperacao: null,
                operadorProximaOperacao: null,
            },
            operadorProximaOperacao: "AND",
        },
        tituloPadrao: "Ocorrência no Campo",
        mensagemPadrao: "O campo ocorrência foi preenchido.",
        tipoMensagem: "INFO",
        quantidadeDiasEntreDatasChave: null,
        respostasPadrao: null,
    },
];

const operacoesGruposEncadeadoOr = [
    {
        id: 71423,
        acaoEnum: "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO",
        operacaoRaiz: {
            id: 71424,
            nomeCampo: "ocorrencia",
            comparadorEnum: "NAO_NULO",
            valorInicial: null,
            valorFinal: null,
            valor: "",
            valores: [],
            proximaOperacao: {
                id: 71425,
                nomeCampo: "nome",
                comparadorEnum: "NAO_NULO",
                valorInicial: null,
                valorFinal: null,
                valor: "",
                valores: [],
                proximaOperacao: null,
                operadorProximaOperacao: null,
            },
            operadorProximaOperacao: "OR",
        },
        tituloPadrao: "Ocorrência no Campo",
        mensagemPadrao: "O campo ocorrência foi preenchido.",
        tipoMensagem: "INFO",
        quantidadeDiasEntreDatasChave: null,
        respostasPadrao: null,
    },
];

test(`#extrairValorResposta deve extrair valor da resposta definida na operação`, () => {
    const registro = { respostas: { ocorrencia: "teste" } };
    const valorA = extrairValorResposta({ nomeCampo: "ocorrencia" } as Operacao, registro.respostas);
    const valorB = extrairValorResposta({ nomeCampo: "nao_existe" } as Operacao, registro.respostas);
    const valorC = extrairValorResposta({ nomeCampo: "ocorrencia" } as Operacao, {});
    const valorD = extrairValorResposta({ nomeCampo: "ocorrencia" } as Operacao, null);

    expect(valorA).toEqual("teste");
    expect(valorB).toEqual(null);
    expect(valorC).toEqual(null);
    expect(valorD).toEqual(null);
});

test(`#Operacao.executar deve retornar CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO`, () => {
    var retornos: any[] = [];

    operacoesGruposSimples.forEach((operacaoGrupo: any) => {
        const registro = { respostas: { ocorrencia: "teste" } };
        retornos.push(buildAcaoStrategy(operacaoGrupo, registro).executar());
    });

    expect(retornos).toStrictEqual([{ tipo: "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO" }]);
});

test(`#Operacao.executar deve lancar Error dado que nao foi definido operador enum`, () => {
    const acaoStrategy = buildAcaoStrategy({ operacaoRaiz: {} } as OperacaoGrupo, { respostas: {} });

    expect(() => acaoStrategy.executar()).toThrow(Error);
    expect(() => acaoStrategy.executar()).toThrow("Não foi definido comparador enum");
});

test(`#Operacao.executar deve retornar falso dado que o operadorProximaOperacao não foi definido`, () => {
    const acaoStrategy = buildAcaoStrategy(
        { operacaoRaiz: { operadorProximaOperacao: "INDEFINIDO", comparadorEnum: "ANY" } } as OperacaoGrupo,
        { respostas: {} }
    );

    const result = acaoStrategy.executar();

    expect(result).toBeFalsy();
});

test(`#Operacao.executar deve retornar null dado que a regra da operação não se concretiza`, () => {
    var retornos: any[] = [];

    operacoesGruposSimples.forEach((operacaoGrupo: any) => {
        const registro = { respostas: { campo_que_nao_eh_ocorrencia: "teste" } };
        retornos.push(buildAcaoStrategy(operacaoGrupo, registro).executar());
    });

    expect(retornos).toStrictEqual([null]);
});

test(`#Operacao.executar deve retornar CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO, com operacao encadeada com AND`, () => {
    var retornos: any[] = [];

    operacoesGruposEncadeadoAnd.forEach((operacaoGrupo: any) => {
        const registro = { respostas: { ocorrencia: "teste", nome: "qualquer" } };
        retornos.push(buildAcaoStrategy(operacaoGrupo, registro).executar());
    });

    expect(retornos).toStrictEqual([{ tipo: "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO" }]);
});
test(`#Operacao.executar deve retornar NULL, com operacao encadeada com AND, na operacao raiz`, () => {
    var retornos: any[] = [];

    operacoesGruposEncadeadoAnd.forEach((operacaoGrupo: any) => {
        const registro = { respostas: { nome_campo_que_nao_eh_ocorrencia: "teste", nome: "qualquer" } };
        retornos.push(buildAcaoStrategy(operacaoGrupo, registro).executar());
    });

    expect(retornos).toStrictEqual([null]);
});

test(`#Operacao.executar deve retornar NULL, com operacao encadeada com AND, na operacao encadeada`, () => {
    var retornos: any[] = [];

    operacoesGruposEncadeadoAnd.forEach((operacaoGrupo: any) => {
        const registro = { respostas: { ocorrencia: "teste", nome_campo_que_nao_eh_nome: "qualquer" } };
        retornos.push(buildAcaoStrategy(operacaoGrupo, registro).executar());
    });

    expect(retornos).toStrictEqual([null]);
});

test(`#Operacao.executar deve retornar CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO, com operacao encadeada com OR`, () => {
    var retornos: any[] = [];

    operacoesGruposEncadeadoOr.forEach((operacaoGrupo: any) => {
        const registro = {
            respostas: { nome_campo_que_nao_eh_ocorrencia: "teste", nome_campo_que_nao_eh_nome: "qualquer" },
        };
        retornos.push(buildAcaoStrategy(operacaoGrupo, registro).executar());
    });

    expect(retornos).toStrictEqual([null]);
});

test(`#Operacao.executar deve retornar CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO, com operacao encadeada com OR, na raiz`, () => {
    var retornos: any[] = [];

    operacoesGruposEncadeadoOr.forEach((operacaoGrupo: any) => {
        const registro = { respostas: { nome_campo_que_nao_eh_ocorrencia: "teste", nome: "qualquer" } };
        retornos.push(buildAcaoStrategy(operacaoGrupo, registro).executar());
    });

    expect(retornos).toStrictEqual([{ tipo: "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO" }]);
});

test(`#Operacao.executar deve retornar CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO, com operacao encadeada com OR, na encadeada`, () => {
    var retornos: any[] = [];

    operacoesGruposEncadeadoOr.forEach((operacaoGrupo: any) => {
        const registro = { respostas: { ocorrencia: "teste", nome_campo_que_nao_eh_nome: "qualquer" } };
        retornos.push(buildAcaoStrategy(operacaoGrupo, registro).executar());
    });

    expect(retornos).toStrictEqual([{ tipo: "CRIAR_REGISTRO_ATIVIDADE_NOTIFICACAO" }]);
});

test(`#executarOperacaoAtual NULO`, () => {
    const operacao = { comparadorEnum: "NULO" } as Operacao;
    const resultadoA = executarOperacaoAtual(operacao, null);
    const resultadoB = executarOperacaoAtual(operacao, undefined);
    const resultadoC = executarOperacaoAtual(operacao, "any");
    const resultadoD = executarOperacaoAtual(operacao, false);

    expect(resultadoA).toBe(true);
    expect(resultadoB).toBe(true);
    expect(resultadoC).toBe(false);
    expect(resultadoD).toBe(true);
});

test(`#executarOperacaoAtual IGUAL`, () => {
    const resultadoA = executarOperacaoAtual({ comparadorEnum: "IGUAL", valor: "A" } as Operacao, null);
    const resultadoB = executarOperacaoAtual({ comparadorEnum: "IGUAL", valor: "B" } as Operacao, undefined);
    const resultadoC = executarOperacaoAtual({ comparadorEnum: "IGUAL", valor: "C" } as Operacao, "C");
    const resultadoD = executarOperacaoAtual({ comparadorEnum: "IGUAL", valor: "5" } as Operacao, 5);

    expect(resultadoA).toBe(false);
    expect(resultadoB).toBe(false);
    expect(resultadoC).toBe(true);
    expect(resultadoD).toBe(true);
});

test(`#executarOperacaoAtual CONTEM`, () => {
    const operacao = { comparadorEnum: "CONTEM", valores: ["5"] } as Operacao;
    const resultadoA = executarOperacaoAtual(operacao, null);
    const resultadoB = executarOperacaoAtual(operacao, undefined);
    const resultadoC = executarOperacaoAtual(operacao, "5");
    const resultadoD = executarOperacaoAtual(operacao, 5);
    const resultadoE = executarOperacaoAtual(operacao, "4");

    expect(resultadoA).toBe(false);
    expect(resultadoB).toBe(false);
    expect(resultadoC).toBe(true);
    expect(resultadoD).toBe(true);
    expect(resultadoE).toBe(false);
});

test(`#executarOperacaoAtual MAIOR_QUE`, () => {
    const operacao = { comparadorEnum: "MAIOR_QUE", valor: "5" } as Operacao;
    const resultadoA = executarOperacaoAtual(operacao, null);
    const resultadoB = executarOperacaoAtual(operacao, undefined);
    const resultadoC = executarOperacaoAtual(operacao, "5");
    const resultadoD = executarOperacaoAtual(operacao, 5);
    const resultadoE = executarOperacaoAtual(operacao, 6);
    const resultadoF = executarOperacaoAtual(operacao, 4);

    expect(resultadoA).toBe(false);
    expect(resultadoB).toBe(false);
    expect(resultadoC).toBe(false);
    expect(resultadoD).toBe(false);
    expect(resultadoE).toBe(true);
    expect(resultadoF).toBe(false);
});

test(`#executarOperacaoAtual MENOR_QUE`, () => {
    const operacao = { comparadorEnum: "MENOR_QUE", valor: "5" } as Operacao;
    const resultadoA = executarOperacaoAtual(operacao, null);
    const resultadoB = executarOperacaoAtual(operacao, undefined);
    const resultadoC = executarOperacaoAtual(operacao, "5");
    const resultadoD = executarOperacaoAtual(operacao, 5);
    const resultadoE = executarOperacaoAtual(operacao, 6);
    const resultadoF = executarOperacaoAtual(operacao, 4);

    expect(resultadoA).toBe(false);
    expect(resultadoB).toBe(false);
    expect(resultadoC).toBe(false);
    expect(resultadoD).toBe(false);
    expect(resultadoE).toBe(false);
    expect(resultadoF).toBe(true);
});

test(`#executarOperacaoAtual ENTRE_OS_VALORES`, () => {
    const operacao = { comparadorEnum: "ENTRE_OS_VALORES", valorInicial: "1", valorFinal: "5" } as Operacao;
    const resultadoA = executarOperacaoAtual(operacao, null);
    const resultadoB = executarOperacaoAtual(operacao, undefined);
    const resultadoC = executarOperacaoAtual(operacao, "5");
    const resultadoD = executarOperacaoAtual(operacao, "1");
    const resultadoE = executarOperacaoAtual(operacao, 5);
    const resultadoF = executarOperacaoAtual(operacao, 1);
    const resultadoG = executarOperacaoAtual(operacao, "4");
    const resultadoH = executarOperacaoAtual(operacao, 4);
    const resultadoI = executarOperacaoAtual(operacao, "0");
    const resultadoJ = executarOperacaoAtual(operacao, 0);
    const resultadoK = executarOperacaoAtual(operacao, "6");
    const resultadoL = executarOperacaoAtual(operacao, 6);

    expect(resultadoA).toBe(false);
    expect(resultadoB).toBe(false);
    expect(resultadoC).toBe(true);
    expect(resultadoD).toBe(true);
    expect(resultadoE).toBe(true);
    expect(resultadoF).toBe(true);
    expect(resultadoG).toBe(true);
    expect(resultadoH).toBe(true);
    expect(resultadoI).toBe(false);
    expect(resultadoJ).toBe(false);
    expect(resultadoK).toBe(false);
    expect(resultadoL).toBe(false);
});

test(`#executarOperacaoAtual NAO_MAPEADO`, () => {
    const operacao = { comparadorEnum: "NAO_MAPEADO" } as Operacao;
    const resultadoA = executarOperacaoAtual(operacao, "ANY");

    expect(resultadoA).toBe(false);
});

test(`#possuiRespostasComValorEsperado deve retornar falso com registro nulo`, () => {
    const operacao = {
        operacaoRaiz: { operadorProximaOperacao: "INDEFINIDO", comparadorEnum: "ANY" },
    } as OperacaoGrupo;
    const registro = null;
    const result = possuiRespostasComValorEsperado(operacao, registro);

    expect(result).toBeFalsy();
});
