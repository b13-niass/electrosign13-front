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
}
