import { AcaoStrategy, Operacao, OperacaoGrupo, RegistroAtividadeNotificacao } from ".";

export const possuiRespostasComValorEsperado = (operacaoGrupo: OperacaoGrupo, registro: any): boolean => {
    if (!registro?.respostas || !operacaoGrupo.operacaoRaiz) {
        return false;
    }
    return executar(operacaoGrupo.operacaoRaiz, registro.respostas);
};

export const executar = (operacao: Operacao, respostas: any): boolean => {
    const valorQueConstaNasRespostas = extrairValorResposta(operacao, respostas);
    if (operacao.comparadorEnum == null) {
        throw Error("Não foi definido comparador enum");
    }
    const resultadoOperacaoAtual = executarOperacaoAtual(operacao, valorQueConstaNasRespostas);
    switch (operacao.operadorProximaOperacao) {
        case "OR":
            return resultadoOperacaoAtual || executar(operacao.proximaOperacao, respostas);
        case "AND":
            return resultadoOperacaoAtual && executar(operacao.proximaOperacao, respostas);
        default:
            return resultadoOperacaoAtual;
    }
};

export const executarOperacaoAtual = (operacao: Operacao, valor: any): boolean => {
    switch (operacao.comparadorEnum) {
        case "NULO":
            return !valor;
        case "IGUAL":
            return `${valor}` === `${operacao.valor}`;
        case "CONTEM":
            return !!valor && !!operacao.valores.find((v) => `${v}` === `${valor}`);
        case "MAIOR_QUE":
            return !!valor && valor > operacao.valor;
        case "MENOR_QUE":
            return !!valor && valor < operacao.valor;
        case "ENTRE_OS_VALORES":
            return !!valor && valor >= operacao.valorInicial && valor <= operacao.valorFinal;
        case "NAO_NULO":
            return !!valor;
        default:
            return false;
    }
};

export const buildAcaoStrategy = (operacaoGrupo: OperacaoGrupo, registro: any): AcaoStrategy => {
    return {
        executar: () => {
            if (possuiRespostasComValorEsperado(operacaoGrupo, registro)) {
                return { tipo: operacaoGrupo.acaoEnum } as RegistroAtividadeNotificacao;
            }
            return null;
        },
    };
};
export const extrairValorResposta = (operacao: Operacao, respostas: any) => {
    if (respostas && respostas[operacao.nomeCampo]) {
        return respostas[operacao.nomeCampo];
    }
    return null;
};
