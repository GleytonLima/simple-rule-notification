export interface Operacao {
    id: number;
    nomeCampo: string;
    comparadorEnum: string;
    valorInicial: string;
    valorFinal: string;
    valor: string;
    valores: string[];
    proximaOperacao: Operacao;
    operadorProximaOperacao: string;
}

export interface OperacaoGrupo {
    id: number;
    formulario: any;
    acaoEnum: string;
    operacaoRaiz: Operacao;
    tipoMensagem: string;
    tituloPadrao: string;
    mensagemPadrao: string;
    quantidadeDiasEntreDatasChave: number;
    respostasPadrao: any;
}

export interface AcaoStrategy {
    executar(): RegistroAtividadeNotificacao | null;
}

export interface RegistroAtividadeNotificacao {
    id: number;
    registroAtividade: any;
    operacaoGrupo: OperacaoGrupo;
    tipo: string;
    lida: boolean;
    titulo: string;
    mensagem: string;
    dadosAdicionais: string;
}
