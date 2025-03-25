import { useState } from "react"
import { OrganigrammeToolbar } from "./organigramme-toolbar"
import { OrganigrammeVisualizer } from "./organigramme-visualizer"
import { AddFilialeDialog } from "./add-filiale-dialog"
import { AddDepartementDialog } from "./add-departement-dialog"
import { AddFonctionDialog } from "./add-fonction-dialog"
import { toast } from "sonner"
import type { Filiale, Departement, Fonction } from "@/@types"

export default function OrganigrammeManagement() {
    const [isAddFilialeOpen, setIsAddFilialeOpen] = useState(false)
    const [isAddDepartementOpen, setIsAddDepartementOpen] = useState(false)
    const [isAddFonctionOpen, setIsAddFonctionOpen] = useState(false)
    const [selectedFiliale, setSelectedFiliale] = useState<Filiale | null>(null)
    const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null)
    const [filiales, setFiliales] = useState<Filiale[]>([
        {
            id: "1",
            libelle: "Siège Social",
            acronyme: "HQ",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departements: [
                {
                    id: "1-1",
                    libelle: "Ressources Humaines",
                    acronyme: "RH",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    fonctions: [
                        {
                            id: "1-1-1",
                            libelle: "Directeur RH",
                            acronyme: "DRH",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        {
                            id: "1-1-2",
                            libelle: "Chargé de recrutement",
                            acronyme: "CR",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                },
                {
                    id: "1-2",
                    libelle: "Finance",
                    acronyme: "FIN",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    fonctions: [
                        {
                            id: "1-2-1",
                            libelle: "Directeur Financier",
                            acronyme: "DF",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                },
            ],
        },
        {
            id: "2",
            libelle: "Filiale Technologique",
            acronyme: "TECH",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departements: [
                {
                    id: "2-1",
                    libelle: "Développement",
                    acronyme: "DEV",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    fonctions: [
                        {
                            id: "2-1-1",
                            libelle: "Lead Developer",
                            acronyme: "LD",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                },
            ],
        },
    ])

    // const { toast } = useToast()

    const handleAddFiliale = (filiale: Omit<Filiale, "id" | "departements" | "createdAt" | "updatedAt">) => {
        const newFiliale: Filiale = {
            id: Date.now().toString(),
            ...filiale,
            departements: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        setFiliales([...filiales, newFiliale])
        toast("Filiale ajoutée",{
            description: `La filiale ${filiale.libelle} a été ajoutée avec succès.`,
        })
        setIsAddFilialeOpen(false)
    }

    const handleAddDepartement = (departement: Omit<Departement, "id" | "fonctions" | "createdAt" | "updatedAt">) => {
        if (!selectedFiliale) return

        const newDepartement: Departement = {
            id: `${selectedFiliale.id}-${Date.now()}`,
            ...departement,
            fonctions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        const updatedFiliales = filiales.map((filiale) => {
            if (filiale.id === selectedFiliale.id) {
                return {
                    ...filiale,
                    departements: [...filiale.departements, newDepartement],
                    updatedAt: new Date().toISOString(),
                }
            }
            return filiale
        })

        setFiliales(updatedFiliales)
        toast("Département ajouté",{
            description: `Le département ${departement.libelle} a été ajouté à la filiale ${selectedFiliale.libelle}.`,
        })
        setIsAddDepartementOpen(false)
    }

    const handleAddFonction = (fonction: Omit<Fonction, "id" | "createdAt" | "updatedAt">) => {
        if (!selectedFiliale || !selectedDepartement) return

        const newFonction: Fonction = {
            id: `${selectedDepartement.id}-${Date.now()}`,
            ...fonction,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        const updatedFiliales = filiales.map((filiale) => {
            if (filiale.id === selectedFiliale.id) {
                return {
                    ...filiale,
                    departements: filiale.departements.map((departement) => {
                        if (departement.id === selectedDepartement.id) {
                            return {
                                ...departement,
                                fonctions: [...departement.fonctions, newFonction],
                                updatedAt: new Date().toISOString(),
                            }
                        }
                        return departement
                    }),
                    updatedAt: new Date().toISOString(),
                }
            }
            return filiale
        })

        setFiliales(updatedFiliales)
        toast("Fonction ajoutée",{
            description: `La fonction ${fonction.libelle} a été ajoutée au département ${selectedDepartement.libelle}.`,
        })
        setIsAddFonctionOpen(false)
    }

    const handleImportOrganigramme = (file: File) => {
        // Ici, vous feriez un appel API pour importer l'organigramme depuis un fichier YAML
        console.log("Import de fichier:", file.name)
        toast("Importation en cours",{
            description: "Le fichier est en cours de traitement.",
        })
    }

    const handleDownloadTemplate = () => {
        // Ici, vous généreriez et téléchargeriez le modèle YAML
        downloadYamlTemplate()
        toast("Téléchargement",{
            description: "Le modèle YAML a été téléchargé.",
        })
    }

    const downloadYamlTemplate = () => {
        // Exemple de modèle YAML pour l'importation d'organigramme
        const yamlTemplate = `# Modèle d'importation d'organigramme
# Structure hiérarchique: Filiales > Départements > Fonctions

filiales:
  - libelle: "Siège Social" # Nom de la filiale
    acronyme: "HQ" # Acronyme de la filiale
    departements:
      - libelle: "Ressources Humaines" # Nom du département
        acronyme: "RH" # Acronyme du département
        fonctions:
          - libelle: "Directeur RH" # Nom de la fonction
            acronyme: "DRH" # Acronyme de la fonction
          - libelle: "Chargé de recrutement"
            acronyme: "CR"
      - libelle: "Finance"
        acronyme: "FIN"
        fonctions:
          - libelle: "Directeur Financier"
            acronyme: "DF"
          - libelle: "Comptable"
            acronyme: "CPT"

  - libelle: "Filiale Technologique"
    acronyme: "TECH"
    departements:
      - libelle: "Développement"
        acronyme: "DEV"
        fonctions:
          - libelle: "Lead Developer"
            acronyme: "LD"
          - libelle: "Développeur Frontend"
            acronyme: "DEV-F"
          - libelle: "Développeur Backend"
            acronyme: "DEV-B"
`

        // Créer un blob avec le contenu YAML
        const blob = new Blob([yamlTemplate], { type: "text/yaml" })

        // Créer une URL pour le blob
        const url = URL.createObjectURL(blob)

        // Créer un élément <a> pour le téléchargement
        const a = document.createElement("a")
        a.href = url
        a.download = "organigramme-template.yaml"

        // Ajouter l'élément au DOM, cliquer dessus, puis le supprimer
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        // Libérer l'URL
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <OrganigrammeToolbar
                onAddFiliale={() => setIsAddFilialeOpen(true)}
                onAddDepartement={() => {
                    if (!selectedFiliale) {
                        toast("Sélection requise",{
                            description: "Veuillez d'abord sélectionner une filiale.",
                            // variant: "destructive",
                        })
                        return
                    }
                    setIsAddDepartementOpen(true)
                }}
                onAddFonction={() => {
                    if (!selectedDepartement) {
                        toast( "Sélection requise",{
                            description: "Veuillez d'abord sélectionner un département.",
                            // variant: "destructive",
                        })
                        return
                    }
                    setIsAddFonctionOpen(true)
                }}
                onImportOrganigramme={handleImportOrganigramme}
                onDownloadTemplate={handleDownloadTemplate}
                selectedFiliale={selectedFiliale}
                selectedDepartement={selectedDepartement}
            />

            <OrganigrammeVisualizer
                filiales={filiales}
                selectedFiliale={selectedFiliale}
                setSelectedFiliale={setSelectedFiliale}
                selectedDepartement={selectedDepartement}
                setSelectedDepartement={setSelectedDepartement}
            />

            <AddFilialeDialog open={isAddFilialeOpen} onOpenChange={setIsAddFilialeOpen} onSubmit={handleAddFiliale} />

            {selectedFiliale && (
                <AddDepartementDialog
                    open={isAddDepartementOpen}
                    onOpenChange={setIsAddDepartementOpen}
                    onSubmit={handleAddDepartement}
                    filiale={selectedFiliale}
                />
            )}

            {selectedDepartement && (
                <AddFonctionDialog
                    open={isAddFonctionOpen}
                    onOpenChange={setIsAddFonctionOpen}
                    onSubmit={handleAddFonction}
                    departement={selectedDepartement}
                />
            )}
        </div>
    )
}

