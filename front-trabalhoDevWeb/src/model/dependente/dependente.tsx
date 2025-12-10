export interface DependenteCreate {
    numInscricao: string;
    nome: string;
    dataNascimento: string;
    sexo: string;
    cpf: string;
    endereco: string;
    telefone: string;
}

export interface Dependente {
    id: number;
    numInscricao: string;
    nome: string;
    dataNascimento: string;
    sexo: string;
    estahAtivo: boolean;
    cpf: string;
    endereco: string;
    telefone: string;
}

export interface DependenteUpdate extends DependenteCreate{
    id: number;
}


