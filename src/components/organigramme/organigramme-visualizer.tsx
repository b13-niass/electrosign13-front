import { Button } from "@/components/shadcn-ui/button"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Badge } from "@/components/shadcn-ui/badge"
import type { Filiale, Departement } from "@/@types"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Building2, FolderKanban, Briefcase } from "lucide-react"

interface OrganigrammeVisualizerProps {
    filiales: Filiale[]
    selectedFiliale: Filiale | null
    setSelectedFiliale: (filiale: Filiale | null) => void
    selectedDepartement: Departement | null
    setSelectedDepartement: (departement: Departement | null) => void
}

export function OrganigrammeVisualizer({
                                           filiales,
                                           selectedFiliale,
                                           setSelectedFiliale,
                                           selectedDepartement,
                                           setSelectedDepartement,
                                       }: OrganigrammeVisualizerProps) {
    const [expandedFiliales, setExpandedFiliales] = useState<Record<string, boolean>>({})
    const [expandedDepartements, setExpandedDepartements] = useState<Record<string, boolean>>({})

    const toggleFiliale = (filialeId: string) => {
        setExpandedFiliales((prev) => ({
            ...prev,
            [filialeId]: !prev[filialeId],
        }))
    }

    const toggleDepartement = (departementId: string) => {
        setExpandedDepartements((prev) => ({
            ...prev,
            [departementId]: !prev[departementId],
        }))
    }

    const handleSelectFiliale = (filiale: Filiale) => {
        if (selectedFiliale?.id === filiale.id) {
            setSelectedFiliale(null)
            setSelectedDepartement(null)
        } else {
            setSelectedFiliale(filiale)
            setSelectedDepartement(null)
            // Ouvrir automatiquement la filiale sélectionnée
            setExpandedFiliales((prev) => ({
                ...prev,
                [filiale.id]: true,
            }))
        }
    }

    const handleSelectDepartement = (departement: Departement) => {
        if (selectedDepartement?.id === departement.id) {
            setSelectedDepartement(null)
        } else {
            setSelectedDepartement(departement)
            // Ouvrir automatiquement le département sélectionné
            setExpandedDepartements((prev) => ({
                ...prev,
                [departement.id]: true,
            }))
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Structure de l&apos;Organigramme</h2>

            <div className="grid grid-cols-1 gap-6">
                {filiales.map((filiale) => (
                    <Card
                        key={filiale.id}
                        className={cn("transition-all duration-200", selectedFiliale?.id === filiale.id && "ring-2 ring-primary")}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-center cursor-pointer" onClick={() => toggleFiliale(filiale.id)}>
                                {expandedFiliales[filiale.id] ? (
                                    <ChevronDown className="h-5 w-5 mr-2 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="h-5 w-5 mr-2 text-muted-foreground" />
                                )}
                                <Building2 className="h-5 w-5 mr-2 text-primary" />
                                <CardTitle
                                    className="text-lg flex-1"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSelectFiliale(filiale)
                                    }}
                                >
                                    {filiale.libelle}
                                </CardTitle>
                                <Badge variant="outline" className="ml-2">
                                    {filiale.acronyme}
                                </Badge>
                            </div>
                        </CardHeader>

                        {expandedFiliales[filiale.id] && (
                            <CardContent>
                                <div className="pl-6 border-l-2 border-muted ml-2 mt-2 space-y-4">
                                    {filiale.departements.length > 0 ? (
                                        filiale.departements.map((departement) => (
                                            <div key={departement.id} className="space-y-2">
                                                <div
                                                    className={cn(
                                                        "flex items-center p-2 rounded-md cursor-pointer hover:bg-muted/50",
                                                        selectedDepartement?.id === departement.id && "bg-muted",
                                                    )}
                                                    onClick={() => toggleDepartement(departement.id)}
                                                >
                                                    {expandedDepartements[departement.id] ? (
                                                        <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    )}
                                                    <FolderKanban className="h-4 w-4 mr-2 text-primary" />
                                                    <div
                                                        className="flex-1 font-medium"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleSelectDepartement(departement)
                                                        }}
                                                    >
                                                        {departement.libelle}
                                                    </div>
                                                    <Badge variant="outline" className="w-sm ml-2">
                                                        {departement.acronyme}
                                                    </Badge>
                                                </div>

                                                {expandedDepartements[departement.id] && (
                                                    <div className="pl-6 border-l-2 border-muted ml-4 space-y-2">
                                                        {departement.fonctions.length > 0 ? (
                                                            departement.fonctions.map((fonction) => (
                                                                <div key={fonction.id} className="flex items-center p-2 rounded-md hover:bg-muted/30">
                                                                    <Briefcase className="h-4 w-4 mr-2 text-primary" />
                                                                    <div className="flex-1">{fonction.libelle}</div>
                                                                    <Badge variant="outline" className="w-sm ml-2">
                                                                        {fonction.acronyme}
                                                                    </Badge>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-sm text-muted-foreground p-2">
                                                                Aucune fonction dans ce département
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-muted-foreground p-2">Aucun département dans cette filiale</div>
                                    )}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}

                {filiales.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <p className="text-muted-foreground mb-4">Aucune filiale n&apos;a été créée</p>
                            <Button onClick={() => document.getElementById("add-filiale-button")?.click()}>
                                Ajouter une filiale
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

