import { LazyExoticComponent, ReactElement } from 'react'

export type DocRouteNav = {
    path: string
    label: string
    component: LazyExoticComponent<() => ReactElement>
}

export type DocumentationRoute = {
    groupName: string
    nav: DocRouteNav[]
}
