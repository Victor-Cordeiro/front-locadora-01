export interface DependenteCreate {
    numInscricao: string;
    nome: string;
    dataNascimento: string;
    sexo: string;
}

export interface Dependente {
    id: number;
    numInscricao: string;
    nome: string;
    dataNascimento: string;
    sexo: string;
    estahAtivo: boolean;
}

export interface DependenteUpdate extends DependenteCreate {
    id?: number; // Opcional pois novos dependentes na edição não têm ID ainda
}