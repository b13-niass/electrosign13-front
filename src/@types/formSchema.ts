
export type CreateDemandeFormSchema = {
    file: File,
    signataires: UserDemande[],
    approbateurs?: UserDemande[],
    ampliateurs?: UserDemande[],
    priority: "FAIBLE" | "MOYENNE" | "HAUTE",
    dateLimite: Date,
    description?: string,
    titre: string,
    fileAttachment?: File[],
}

export type UserDemande = {
    id?: string;
    action?: string;
    ordre?: string;
};