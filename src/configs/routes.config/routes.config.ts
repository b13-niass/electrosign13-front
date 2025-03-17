import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/dashboard',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'utilisateurMenuItem',
        path: '/utilisateurs',
        component: lazy(() => import('@/views/pages/UtilisateurView')),
        authority: [],
    },
    {
        key: 'demandeMenu',
        path: '/demandes',
        component: lazy(() => import('@/views/pages/DemandeView')),
        authority: [],
    },
    {
        key: 'documentMenu',
        path: '/documents',
        component: lazy(() => import('@/views/pages/DocumentView')),
        authority: [],
    },
    {
        key: 'createDemandeMenu',
        path: '/create-demande',
        component: lazy(() =>
            import('@/views/pages/CreateDemandeView')
        ),
        authority: [],
    },
    {
        key: 'organigrammeMenu',
        path: '/organigrammes',
        component: lazy(() => import('@/views/pages/OrganigrammeView')),
        authority: [],
    },
    {
        key: 'parametreMenu',
        path: '/parametres',
        component: lazy(() =>
            import('@/views/pages/ParametreView')
        ),
        authority: [],
    }
]
