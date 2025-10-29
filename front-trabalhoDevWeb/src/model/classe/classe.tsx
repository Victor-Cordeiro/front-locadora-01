export interface Classe{
    id: number;
    nome: string;
    valor: string;
    prazoDevolucao: string;
   
}

export interface ClasseCreate{
    nome: string;
    valor: string;
    prazoDevolucao: string;
}

export interface ClasseUpdate extends ClasseCreate{
    id: number;
}

export type ClasseArray = Classe[];