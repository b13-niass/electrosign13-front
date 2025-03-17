import { LayoutContext } from '@/utils/hooks/useLayout'
import type { LayoutContextProps } from '@/utils/hooks/useLayout'
import type { CommonProps } from '@/@types/common'
import { Toaster } from "@/components/shadcn-ui/sonner";

type LayoutBaseProps = CommonProps & LayoutContextProps

const LayoutBase = (props: LayoutBaseProps) => {
    const {
        children,
        className,
        adaptiveCardActive,
        type,
        pageContainerReassemble,
    } = props

    return (
        <LayoutContext.Provider
            value={{ adaptiveCardActive, pageContainerReassemble, type }}
        >
            <div className={className}>{children}</div>
            <Toaster />
        </LayoutContext.Provider>
    )
}

export default LayoutBase
