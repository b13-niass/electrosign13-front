export interface ApiResponseFormat<T>{
    status: string;
    message: string;
    data: T;
}

export type User = {
    id?: string
    nom?: string
    prenom?: string
    email?: string
    photo?: string
    telephone?: string
    publicKey?: string
    mySignature?: string
    fonction?: string
    rolesLibelle?: string[]
    roles?: Role []
}

export type Role = {
    id?: string
    libelle?: string
}

export type Fonction = {
    id: string
    libelle: string
    acronyme: string
}
