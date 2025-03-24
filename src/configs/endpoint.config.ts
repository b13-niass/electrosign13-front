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
}

export default endpointConfig
