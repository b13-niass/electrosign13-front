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
    roles?: Role[]
    active?: boolean
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
    id?: string
    prenom: string
    nom: string
    email: string
    password: string
    telephone?: string
    photo?: string|File
    cni?: string
    fonctionId: number
    fonctionNom?: string
    roles: string[]
    active?: boolean
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

export type SignatureStatus =
    | "EN_ATTENTE_APPROBATION"
    | "APPROUVEE"
    | "EN_ATTENTE_SIGNATURE"
    | "SIGNEE"
    | "REFUSEE"
    | "ANNULEE";

export type Participant = {
    id: number
    name: string
    email: string
    role: string
    hasSigned: boolean
    currentSigner: boolean
    ordre: number
    action: string
    signature?: string
}

export type SignatureRequest = {
    id: number
    titre: string
    description: string
    dateCreated: Date
    dateLimite: Date
    status: SignatureStatus
    priority: string
    documentUrl: string
    signataires: Participant[]
    approbateurs: Participant[]
    ampliateurs: Participant[]
    sender: {
        id: number
        nom: string
        prenom: string
        email: string
        fonction: string
        acronyme: string
    }
    isCurrentUserSigner: boolean
    isCurrentUserApprobateur: boolean
    currentUserSigner?: boolean
    currentUserApprobateur?: boolean
}

export type DocumentBase64 = {
    nom?: string
    type?: string
    contenuBase64?: string
}