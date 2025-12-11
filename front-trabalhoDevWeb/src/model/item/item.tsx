import { Titulo } from "../titulo/titulo";

export interface Item {
    id: number;
    numSerie: string;
    dtAquisicao: string;
    tipoItem: string;
    titulo?: Titulo;      // Pode vir completo ou nulo dependendo da rota
    tituloId?: number;    // Novo campo vindo do backend
    nomeTitulo?: string;  // Novo campo vindo do backend
}

export interface ItemRequest {
    numSerie: string;
    dtAquisicao: string;
    tipoItem: string;
    titulo: number;
}