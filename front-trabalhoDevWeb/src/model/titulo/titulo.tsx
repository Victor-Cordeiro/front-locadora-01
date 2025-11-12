import { Ator } from "../ator/ator";
import { Classe } from "../classe/classe";
import { Diretor } from "../diretor/diretor";

export interface Titulo{
    id: number;
    nome: string;
    ano: string;
    sinopse: string;
    categoria: string;
    atores: Ator[];
    diretor: Diretor;
    classe: Classe;
}

export interface TituloCreate{
    nome: string;
    ano: string;
    sinopse: string;
    categoria: string;
    atores: number[];
    diretor: number;
    classe: number;
}

export interface TituloUpdate extends TituloCreate {
  id: number;
}

export type TituloArray = Titulo[];