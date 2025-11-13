import { Titulo } from "../titulo/titulo";

export interface Item{
    id: number;
    numSerie: string;
    dtAquisicao: string;
    tipoItem: string;
    titulo: Titulo;
}

export interface ItemRequest{
    numSerie: string;
    dtAquisicao: string;
    tipoItem: string;
    titulo: number;
}
