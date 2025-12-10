export interface Classe {
    id: number;
    nome: string;
    valor: number; // Alterado para number para facilitar cálculos, se necessário
    prazoDevolucao: number; // Agora é number (dias)
}

export interface ClasseCreate {
    nome: string;
    valor: number;
    prazoDevolucao: number;
}

export interface ClasseUpdate extends ClasseCreate {
    id: number;
}

export type ClasseArray = Classe[];