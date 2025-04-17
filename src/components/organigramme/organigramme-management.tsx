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
            libelle: "Filiale0",
            acronyme: "F0",
            createdAt: "2025-03-15T21:54:58.000Z",
            updatedAt: "2025-03-15T21:55:00.000Z",
            departements: [
                {
                    id: "1",
                    libelle: "Département R&D",
                    acronyme: "DRD",
                    createdAt: "2025-03-15T22:04:52.000Z",
                    updatedAt: "2025-03-15T22:04:57.000Z",
                    fonctions: [
                        {
                            id: "1",
                            libelle: "Chef de Projet",
                            acronyme: "CP",
                            createdAt: "2025-03-15T22:06:39.000Z",
                            updatedAt: "2025-03-15T22:06:41.000Z",
                        },
                        {
                            id: "2",
                            libelle: "Ingénieurs R&D",
                            acronyme: "IRD",
                            createdAt: "2025-03-15T22:07:41.000Z",
                            updatedAt: "2025-03-15T22:07:42.000Z",
                        },
                        {
                            id: "32",
                            libelle: "Directeur Département R&D",
                            acronyme: "DDRD",
                            createdAt: "2025-03-19T08:12:46.000Z",
                            updatedAt: "2025-03-19T08:12:49.000Z",
                        },
                        {
                            id: "34",
                            libelle: "Techniciens",
                            acronyme: "TECH",
                            createdAt: "2025-03-19T08:14:30.000Z",
                            updatedAt: "2025-03-19T08:14:35.000Z",
                        },
                        {
                            id: "38",
                            libelle: "ADMIN",
                            acronyme: "ADMIN",
                            createdAt: "2025-03-19T08:40:59.000Z",
                            updatedAt: "2025-03-19T08:41:02.000Z",
                        },
                    ],
                },
                {
                    id: "2",
                    libelle: "Département Production",
                    acronyme: "DP",
                    createdAt: "2025-03-15T22:05:39.000Z",
                    updatedAt: "2025-03-15T22:05:41.000Z",
                    fonctions: [
                        {
                            id: "35",
                            libelle: "Directeur Département Production",
                            acronyme: "DDP",
                            createdAt: "2025-03-19T08:22:59.000Z",
                            updatedAt: "2025-03-19T08:23:00.000Z",
                        },
                        // {
                        //     id: "36",
                        //     libelle: "Responsable Qualité",
                        //     acronyme: "RQ",
                        //     createdAt: "2025-03-19T08:24:39.000Z",
                        //     updatedAt: "2025-03-19T08:24:40.000Z",
                        // },
                        // {
                        //     id: "37",
                        //     libelle: "Responsable Chaîne de Production",
                        //     acronyme: "RCP",
                        //     createdAt: "2025-03-19T08:38:17.000Z",
                        //     updatedAt: "2025-03-19T08:38:23.000Z",
                        // },
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

