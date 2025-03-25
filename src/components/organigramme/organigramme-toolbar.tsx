import type React from "react"

import { Button } from "@/components/shadcn-ui/button"
import { Download, Upload, Plus } from "lucide-react"
import { useRef } from "react"
import type { Filiale, Departement } from "@/@types"

interface OrganigrammeToolbarProps {
    onAddFiliale: () => void
    onAddDepartement: () => void
    onAddFonction: () => void
    onImportOrganigramme: (file: File) => void
    onDownloadTemplate: () => void
    selectedFiliale: Filiale | null
    selectedDepartement: Departement | null
}

export function OrganigrammeToolbar({
                                        onAddFiliale,
                                        onAddDepartement,
                                        onAddFonction,
                                        onImportOrganigramme,
                                        onDownloadTemplate,
                                        selectedFiliale,
                                        selectedDepartement,
                                    }: OrganigrammeToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onImportOrganigramme(file)
        }
        // Réinitialiser l'input pour permettre de sélectionner le même fichier
        if (e.target) {
            e.target.value = ""
        }
    }

    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
                <Button onClick={onAddFiliale}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une Filiale
                </Button>

                <Button
                    onClick={onAddDepartement}
                    variant={selectedFiliale ? "default" : "outline"}
                    disabled={!selectedFiliale}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un Département
                    {selectedFiliale && <span className="ml-1 text-xs opacity-90">({selectedFiliale.libelle})</span>}
                </Button>

                <Button
                    onClick={onAddFonction}
                    variant={selectedDepartement ? "default" : "outline"}
                    disabled={!selectedDepartement}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une Fonction
                    {selectedDepartement && <span className="ml-1 text-xs opacity-90">({selectedDepartement.libelle})</span>}
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Modèle YAML
                </Button>

                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer
                </Button>
                <input ref={fileInputRef} type="file" accept=".yaml,.yml" className="hidden" onChange={handleFileChange} />
            </div>
        </div>
    )
}

