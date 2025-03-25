"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn-ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/shadcn-ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"

// Données fictives pour les fonctions - réduites pour améliorer les performances
const fonctions = [
    { value: 1, label: "Directeur" },
    { value: 2, label: "Responsable RH" },
    { value: 3, label: "Développeur" },
    { value: 4, label: "Designer" },
    { value: 5, label: "Chef de projet" },
]

interface FonctionComboboxProps {
    value: number | undefined
    onChange: (value: number) => void
}

export function FonctionCombobox({ value, onChange }: FonctionComboboxProps) {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredFonctions, setFilteredFonctions] = useState(fonctions)

    // Filtrer les fonctions en fonction du terme de recherche
    useEffect(() => {
        if (searchTerm) {
            const filtered = fonctions.filter((fonction) => fonction.label.toLowerCase().includes(searchTerm.toLowerCase()))
            setFilteredFonctions(filtered)
        } else {
            setFilteredFonctions(fonctions)
        }
    }, [searchTerm])

    // Trouver le label de la fonction sélectionnée
    const selectedFonction = fonctions.find((fonction) => fonction.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {value && selectedFonction ? selectedFonction.label : "Sélectionner une fonction..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Rechercher une fonction..." onValueChange={setSearchTerm} />
                    <CommandList>
                        <CommandEmpty>Aucune fonction trouvée.</CommandEmpty>
                        <CommandGroup className="max-h-40 overflow-y-auto">
                            {filteredFonctions.map((fonction) => (
                                <CommandItem
                                    key={fonction.value}
                                    value={fonction.label}
                                    onSelect={() => {
                                        onChange(fonction.value)
                                        setOpen(false)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === fonction.value ? "opacity-100" : "opacity-0")} />
                                    {fonction.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

