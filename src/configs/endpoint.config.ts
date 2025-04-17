export const apiPrefix = '/api/v1/'

const endpointConfig = {
    signIn: '/public/auth/login',
    refreshToken: '/public/auth/refresh-token',
    signOut: '/sign-out',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    user: '/private/users',
    getAllUser: '/private/users/all',
    getUsers: '/private/users/allUsers',
    getAllRole: '/private/roles/all',
    getAllFonction: '/private/fonctions/all',
    createDemande: '/private/demandes',
    getDemandesEnvoyees: '/private/demandes/envoyees',
    getDemandesRecues: '/private/demandes/recues',
    getDashboardData: '/private/demandes/dashboard',
    getDocumentByDemandeId: '/private/demandes/:idDemande/document',
    getDemandeById: '/private/demandes/:idDemande',
    signerDemande: '/private/demandes/signer',
    approuverDemande: '/private/demandes/:idDemande/approuver',
    rejeterDemande: '/private/demandes/:idDemande/rejeter',
    desactiverUser: '/private/users/desactiverUser/:idUser',
    activerUser: '/private/users/activerUser/:idUser',
    archiveDocuments: '/private/demandes/archiveDocuments',
    getArchiveStats: '/private/demandes/getArchiveStats',
    getSignedDocumentsForDownload: '/private/documents/demande/:demandeId/download-info',
    downloadDocument: '/private/documents/download/:documentId',

}

export default endpointConfig
