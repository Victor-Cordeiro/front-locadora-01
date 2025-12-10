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
    // Campos opcionais caso você decida incluí-los no DTO do backend futuramente para facilitar a visualização
    nomeCliente?: string; 
    tituloItem?: string;
    numSerieItem?: string; 
}

export interface LocacaoUpdate extends LocacaoCreate {
    id: number;
}

export type LocacaoArray = Locacao[];