export interface LocacaoCreate {
    idCliente: number;
    idItem: number;
    valorCobrado?: number;
    dtDevolucaoPrevista: string; // YYYY-MM-DD
}

export interface Locacao {
    id: number;
    dtLocacao: string;
    dtDevolucaoPrevista: string;
    dtDevolucaoEfetiva?: string;
    valorCobrado: number;
    multaCobrada?: number;
    
    // Novos campos vindos do Backend atualizado
    idCliente: number;
    nomeCliente: string;
    numInscricaoCliente?: string;
    
    idItem: number;
    tituloItem: string;
    numSerieItem: string;
    tipoItem: string;
}

export interface LocacaoUpdate extends LocacaoCreate {
    id: number;
}

export type LocacaoArray = Locacao[];