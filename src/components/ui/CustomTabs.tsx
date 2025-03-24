import type React from "react"
import { cn } from "@/lib/utils"

interface TabProps {
    children: React.ReactNode
    value: string
    isActive: boolean
    onClick: (value: string) => void
}

export function CustomTab({ children, value, isActive, onClick }: TabProps) {
    return (
        <button
            className={cn(
                "flex-1 py-3 text-lg px-4 text-center font-medium transition-colors",
                isActive ? "bg-black font-bold text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
            onClick={() => onClick(value)}
        >
            {children}
        </button>
    )
}

interface TabsProps {
    children: React.ReactNode
    className?: string
}

export function CustomTabs({ children, className }: TabsProps) {
    return <div className={cn("flex rounded-t-lg overflow-hidden", className)}>{children}</div>
}

