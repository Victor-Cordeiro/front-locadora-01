import { Dependente, DependenteCreate, DependenteUpdate } from "../dependente/dependente";

export interface SocioCreate {
    numInscricao: string;
    nome: string;
    dataNascimento: string;
    sexo: string;
    cpf: string;
    endereco: string;
    telefone: string;
    dependentes: DependenteCreate[];
}

export interface Socio {
    id: number;
    numInscricao: string;
    nome: string;
    dataNascimento: string;
    sexo: string;
    estahAtivo: boolean;
    cpf: string;
    endereco: string;
    telefone: string;
    dependentes: Dependente[];
}

export interface SocioUpdate {
    id: number;
    numInscricao: string;
    nome: string;
    dataNascimento: string;
    sexo: string;
    cpf: string;
    endereco: string;
    telefone: string;
    dependentes: DependenteUpdate[];
}

export type SocioArray = Socio[];