import { AcaoStrategy, Operacao, OperacaoGrupo, RegistroAtividadeNotificacao } from ".";

export const possuiRespostasComValorEsperado = (operacaoGrupo: OperacaoGrupo, registro: any): boolean => {
    console.log("Inicio da verificação de respostas com valor esperado", operacaoGrupo, registro);
    if (!registro?.respostas || !operacaoGrupo.operacaoRaiz) {
        return false;
    }
    return executar(operacaoGrupo.operacaoRaiz, registro.respostas);
};

export const executar = (operacao: Operacao, respostas: any): boolean => {
    console.info(`Inicio operacao ${operacao.id} e respostas ${JSON.stringify(respostas)}`);
    let valorQueConstaNasRespostas = null;
    if (respostas) {
        const resposta = respostas[operacao.nomeCampo];
        if (resposta) {
            valorQueConstaNasRespostas = resposta;
        }
    }
    if (operacao.comparadorEnum == null) {
        console.error("O objeto não possui comparador definido");
        throw Error("Não foi definido comparador enum");
    }
    var resultadoOperacaoAtual = executarOperacaoAtual(operacao, valorQueConstaNasRespostas);
    if (operacao.operadorProximaOperacao != null) {
        switch (operacao.operadorProximaOperacao) {
            case "OR":
                resultadoOperacaoAtual = resultadoOperacaoAtual || executar(operacao.proximaOperacao, respostas);
                break;
            case "AND":
                resultadoOperacaoAtual = resultadoOperacaoAtual && executar(operacao.proximaOperacao, respostas);
                break;
            default:
                break;
        }
    }
    console.info(`Fim da operacao ${operacao.id} e resultado ${resultadoOperacaoAtual}`);
    return resultadoOperacaoAtual;
};

export const executarOperacaoAtual = (operacao: Operacao, valor: any): boolean => {
    let resultadoOperacaoAtual = false;
    switch (operacao.comparadorEnum) {
        case "NULO":
            resultadoOperacaoAtual = !valor;
            break;
        case "IGUAL":
            resultadoOperacaoAtual = valor == operacao.valor;
            break;
        case "CONTEM":
            resultadoOperacaoAtual = !!valor && !!operacao.valores.find((v) => v == valor);
            break;
        case "MAIOR_QUE":
            resultadoOperacaoAtual = !!valor && valor > operacao.valor;
            break;
        case "MENOR_QUE":
            resultadoOperacaoAtual = !!valor && valor < operacao.valor;
            break;
        case "ENTRE_OS_VALORES":
            resultadoOperacaoAtual = !!valor && valor >= operacao.valorInicial && valor <= operacao.valorFinal;
            break;
        case "NAO_NULO":
            resultadoOperacaoAtual = !!valor;
            break;
        default:
            console.warn("O objeto não possui execucao definida para o operador: ", operacao.comparadorEnum);
            break;
    }
    return resultadoOperacaoAtual;
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
