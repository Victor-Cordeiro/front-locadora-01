export interface Ator{
    id: number;
    nome: string;
   
}

export interface AtorCreate{
    nome: string;
}

export interface AtorUpdate extends AtorCreate{
    id: number;
}

export interface AtorArray extends Array<Ator>{

}