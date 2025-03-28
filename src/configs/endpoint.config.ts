export const apiPrefix = '/api/v1/'

const endpointConfig = {
    signIn: '/public/auth/login',
    refreshToken: '/public/auth/refresh-token',
    signOut: '/sign-out',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    getAllUser: '/private/users/all',
    createDemande: '/private/demandes',
    getDemandesEnvoyees: '/private/demandes/envoyees',
    getDemandesRecues: '/private/demandes/recues',
    getDashboardData: '/private/demandes/dashboard',
    getDocumentByDemandeId: '/private/demandes/:idDemande/document',
    getDemandeById: '/private/demandes/:idDemande',
    signerDemande: '/api/demandes/:idDemande/signer',
    approuverDemande: '/api/demandes/:idDemande/approuver',
    refuserDemande: '/api/demandes/:idDemande/refuser',
}

export default endpointConfig
