export type SignInCredential = {
    email: string
    password: string
}

// export type SignInResponse = {
//     token: string
//     user: {
//         userId: string
//         userName: string
//         authority: string[]
//         avatar: string
//         email: string
//     }
// }

export type SignInResponse = {
    access_token: string
    refresh_token?: string
    expires_in?:string
    refresh_expires_in?: string
    token_type?: string
    user: UserType
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'OK' | 'KO' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type UserType = {
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
    roles?: RoleType []
}

export type RoleType = {
    id?: string
    libelle?: string
}

export type FonctionType = {
    id: string
    libelle: string
    acronyme: string
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: UserType) => void
    redirect: () => void
}
