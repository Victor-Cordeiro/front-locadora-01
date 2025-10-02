export interface Diretor{
    id: number;
    nome: string;
   
}

export interface DiretorCreate{
    nome: string;
}

export interface DiretorUpdate extends DiretorCreate{
    id: number;
}

export interface DiretorArray extends Array<Diretor>{

}