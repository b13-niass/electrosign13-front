import cookiesStorage from '@/utils/cookiesStorage'
import appConfig from '@/configs/app.config'
import { TOKEN_NAME_IN_STORAGE } from '@/constants/api.constant'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserType } from '@/@types/auth'

type Session = {
    signedIn: boolean
}

type TokenValidity = {
    isValid: boolean
}

type AuthState = {
    session: Session
    user: UserType
    tokenValidity: TokenValidity
}

type AuthAction = {
    setSessionSignedIn: (payload: boolean) => void
    setUser: (payload: UserType) => void
    setTokenValidity: (payload: boolean) => void
}

const getPersistStorage = () => {
    if (appConfig.accessTokenPersistStrategy === 'localStorage') {
        return localStorage
    }

    if (appConfig.accessTokenPersistStrategy === 'sessionStorage') {
        return sessionStorage
    }

    return cookiesStorage
}

const initialState: AuthState = {
    session: {
        signedIn: false,
    },
    tokenValidity: {
        isValid: true
    },
    user: {
        id: '',
        nom: '',
        prenom: '',
        email: '',
        photo: '',
        telephone: '',
        publicKey: '',
        mySignature: '',
        fonction: '',
        rolesLibelle: [],
        roles: []
    },
}

export const useSessionUser = create<AuthState & AuthAction>()(
    persist(
        (set) => ({
            ...initialState,
            setSessionSignedIn: (payload) =>
                set((state) => ({
                    session: {
                        ...state.session,
                        signedIn: payload,
                    },
                })),
            setUser: (payload) =>
                set((state) => ({
                    user: {
                        ...state.user,
                        ...payload,
                    },
                })),
            setTokenValidity: (payload) => set((state) => ({
                tokenValidity: {
                    ...state.tokenValidity,
                    isValid: payload,
                }
            }))
        }),
        { name: 'sessionUser', storage: createJSONStorage(() => localStorage) },
    ),
)

export const useToken = () => {
    const storage = getPersistStorage()

    const setToken = (token: string) => {
        storage.setItem(TOKEN_NAME_IN_STORAGE, token)
    }

    return {
        setToken,
        token: storage.getItem(TOKEN_NAME_IN_STORAGE),
    }
}
