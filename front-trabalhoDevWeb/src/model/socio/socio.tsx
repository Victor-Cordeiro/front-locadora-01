import { Dependente, DependenteCreate } from "../dependente/dependente";

export interface SocioCreate {
    numInscricao: string;
    nome: string;
    dataNascimento: string;
    sexo: string;
    cpf: string;
    endereco: string;
    telefone: string;
    // Aceita tanto a interface completa (leitura) quanto a de criação (escrita)
    dependentes: (Dependente | DependenteCreate)[];
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

export interface SocioUpdate extends SocioCreate {
    id: number;
}

export type SocioArray = Socio[];