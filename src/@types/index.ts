export interface ApiResponseFormat<T>{
    status: string;
    message: string;
    data: T;
}

export type User = {
    readonly id?: string
    nom?: string
    prenom?: string
    email?: string
    photo?: string
    telephone?: string
    publicKey?: string
    mySignature?: string
    fonction?: string
    fonctionObject?: Fonction
    rolesLibelle?: string[]
    roles?: Role []
}

export type Role = {
    readonly id?: string
    libelle?: string
}

export type Fonction = {
    readonly id: string
    libelle: string
    acronyme: string
    createdAt?: string
    updatedAt?: string
}

export type AddUser = {
    id: string
    prenom: string
    nom: string
    email: string
    password: string
    telephone?: string
    photo?: string
    cni?: string
    fonctionId: number
    fonctionNom?: string
    roles: string[]
    active: boolean
}

export type Departement = {
    id: string
    libelle: string
    acronyme: string
    fonctions: Fonction[]
    createdAt: string
    updatedAt: string
}

export type Filiale = {
    id: string
    libelle: string
    acronyme: string
    departements: Departement[]
    createdAt: string
    updatedAt: string
}
