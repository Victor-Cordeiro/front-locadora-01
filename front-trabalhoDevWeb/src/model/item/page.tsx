export interface Item{
    id: number;
    numSerie: string;
    dtAquisicao: string;
    tipoItem: string;
   
}

export interface ItemCreate{
    numSerie: string;
    dtAquisicao: string;
    tipoItem: string;
}

export interface ItemUpdate extends ItemCreate{
    id: number;
}

export type ItemArray = Item[];