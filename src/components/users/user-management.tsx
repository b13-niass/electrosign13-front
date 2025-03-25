import { useState } from "react"
import { UserToolbar } from "./user-toolbar"
import { UserDataTable } from "./user-data-table"
import { AddUserDialog } from "./add-user-dialog"
import { toast } from "sonner"
import type { AddUser } from "@/@types"
import { downloadYamlTemplate } from '@/components/users/yaml-template'

const UserManagement = () => {
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const handleAddUser = (user: AddUser) => {
        // Ici, vous feriez un appel API pour ajouter l'utilisateur
        console.log("Ajout d'utilisateur:", user)
        toast("Utilisateur ajouté", {
            description: `${user.prenom} ${user.nom} a été ajouté avec succès.`,
        })
        setIsAddUserOpen(false)
    }

    const handleImportUsers = (file: File) => {
        // Ici, vous feriez un appel API pour importer les utilisateurs
        console.log("Import de fichier:", file.name)
        toast("Importation en cours", {
            description: "Le fichier est en cours de traitement.",
        })
    }

    const handleDownloadTemplate = () => {
        // Ici, vous généreriez et téléchargeriez le modèle YAML
        console.log("Téléchargement du modèle")
        downloadYamlTemplate()
        toast("Téléchargement", {
            description: "Le modèle YAML a été téléchargé.",
        })
    }

    return (
        <div className="container border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 bg-[#FFFFFF] px-4 py-7 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h1>

            <div className="space-y-4">
                <UserToolbar
                    onAddUser={() => setIsAddUserOpen(true)}
                    onImportUsers={handleImportUsers}
                    onDownloadTemplate={handleDownloadTemplate}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                />

                <UserDataTable searchQuery={searchQuery} statusFilter={statusFilter} />

                {isAddUserOpen && (
                    <AddUserDialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen} onSubmit={handleAddUser} />
                )}
            </div>
        </div>
    )
}

export default UserManagement

