import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/dashboard',
        component: lazy(() => import('@/views/Home')),
        authority: ["SIGNATAIRE", "APPROBATEUR", "INITIATEUR"],
    },
    {
        key: 'utilisateurMenuItem',
        path: '/utilisateurs',
        component: lazy(() => import('@/views/pages/UtilisateurView')),
        authority: ["ADMIN"],
    },
    {
        key: 'demandeMenu',
        path: '/demandes',
        component: lazy(() => import('@/views/pages/DemandeView')),
        authority: ["SIGNATAIRE", "APPROBATEUR", "INITIATEUR"],
    },
    // {
    //     key: 'documentMenu',
    //     path: '/documents',
    //     component: lazy(() => import('@/views/pages/DocumentView')),
    //     authority: [],
    // },
    {
        key: 'signerDemandeMenu',
        path: '/signer-demande/:documentId',
        component: lazy(() => import('@/views/pages/SignerDemandeView')),
        authority: ["SIGNATAIRE"],
    },
    {
        key: 'createDemandeMenu',
        path: '/create-demande',
        component: lazy(() =>
            import('@/views/pages/CreateDemandeView')
        ),
        authority: ["SIGNATAIRE", "APPROBATEUR", "INITIATEUR"],
    },
    {
        key: 'organigrammeMenu',
        path: '/organigrammes',
        component: lazy(() => import('@/views/pages/OrganigrammeView')),
        authority: ["ADMIN"],
    },
    {
        key: 'parametreMenu',
        path: '/parametres',
        component: lazy(() =>
            import('@/views/pages/ParametreView')
        ),
        authority: ["ADMIN"],
    }
]
