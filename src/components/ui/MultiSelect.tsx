"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/shadcn-ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/shadcn-ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"
import { cn } from "@/lib/utils"

export type Option = {
    label: string
    value: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (values: string[]) => void
    placeholder?: string
    emptyMessage?: string
    className?: string
    badgeClassName?: string
    titre?: string
}

export function MultiSelect({
                                options,
                                selected,
                                onChange,
                                placeholder = "Sélectionner des options...",
                                emptyMessage = "Aucune option trouvée.",
                                className,
                                badgeClassName,
                                titre = "Sélectionner des options"
                            }: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (value: string) => {
        onChange(selected.filter((item) => item !== value))
    }

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value))
        } else {
            onChange([...selected, value])
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
                <h5>{titre}</h5>
            <PopoverTrigger asChild>

                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                        className,
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length > 0 ? (
                            selected.map((value) => {
                                const option = options.find(
                                    (opt) => opt.value === value,
                                )
                                return (
                                    <Badge
                                        key={value}
                                        variant="secondary"
                                        className={cn(
                                            'flex items-center gap-1 px-2 py-1',
                                            badgeClassName,
                                        )}
                                    >
                                        {option?.label}
                                        <button
                                            type="button"
                                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleUnselect(value)
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )
                            })
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                    </div>
                    <div className="flex">
                        {selected.length > 0 && (
                            <button
                                type="button"
                                className="mr-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onChange([])
                                }}
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => {
                                const isSelected = selected.includes(
                                    option.value,
                                )
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() =>
                                            handleSelect(option.value)
                                        }
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50',
                                            )}
                                        >
                                            {isSelected && (
                                                <span className="h-2 w-2 bg-current rounded-sm" />
                                            )}
                                        </div>
                                        {option.label}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

