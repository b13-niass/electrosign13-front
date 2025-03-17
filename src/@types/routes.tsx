import { LayoutType } from './theme'
import { LazyExoticComponent, ReactElement, ReactNode } from 'react'

export type PageHeaderProps = {
    title?: string | ReactNode | LazyExoticComponent<() => ReactElement>
    description?: string | ReactNode
    contained?: boolean
    extraHeader?: string | ReactNode | LazyExoticComponent<() => ReactElement>
}

export interface Meta {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    pageBackgroundType?: 'default' | 'plain'
    header?: PageHeaderProps
    footer?: boolean
    layout?: LayoutType
}

export type Route = {
    key: string
    path: string
    component: LazyExoticComponent<<T extends Meta>(props: T) => ReactElement>
    authority: string[]
    meta?: Meta
}

export type Routes = Route[]
