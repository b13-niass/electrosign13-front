import { useEffect, useState } from 'react'
import { UserToolbar } from "./user-toolbar"
import { UserDataTable } from "./user-data-table"
import { AddUserDialog } from "./add-user-dialog"
import { toast } from "sonner"
import type { AddUser, Fonction, User } from '@/@types'
import { downloadYamlTemplate } from '@/components/users/yaml-template'
import userService from '@/services/UserService'

const UserManagement = () => {
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [users, setUsers] = useState<AddUser[]>([])
    const [canFetch, setCanFetch] = useState<boolean>()

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await userService.getUsers();
            if (result.status == 'OK'){
                console.log(result.data)
                const dataUser = transformUserToAddUser(result.data);
                setUsers(dataUser)
            }
        }
        fetchUsers();
    }, [canFetch])
    const transformUserToAddUser = (users: User[]): AddUser[] => {
       const addUsers : AddUser[] =   users.map(user => {
           console.log(user.fonction)
           const fonction = user.fonction! as unknown as Fonction
                return {
                id: user.id ?? '',
                prenom: user.prenom ?? '',
                nom: user.nom ?? '',
                email: user.email ?? '',
                password: '',
                telephone: user.telephone,
                photo: user.photo,
                cni: '',
                fonctionId: parseInt(fonction.id) ?? 0,
                fonctionNom: fonction.libelle,
                roles: user.roles!.map(role => role.libelle!) ?? [],
                active: user.active
            }
        });

       return addUsers;
    }
    const transformOneUserToAddUser = (user: User): AddUser => {
            const fonction = user.fonction! as unknown as Fonction
            return {
                id: user.id ?? '',
                prenom: user.prenom ?? '',
                nom: user.nom ?? '',
                email: user.email ?? '',
                password: '',
                telephone: user.telephone,
                photo: user.photo,
                cni: '',
                fonctionId: parseInt(fonction.id) ?? 0,
                fonctionNom: fonction.libelle,
                roles: user.roles!.map(role => role.libelle!) ?? [],
                active: user.active
            }
    }
    const handleAddUser = async (user: AddUser) => {
        // Ici, vous feriez un appel API pour ajouter l'utilisateur
        console.log("Ajout d'utilisateur:", user)
        const result = await userService.createUser(user);
        console.log(result)
        if (result.status == 'OK'){
            // users.push(transformOneUserToAddUser(result.data))
            // setUsers(users)
            setCanFetch(prevState => !prevState)
            toast("Utilisateur ajouté", {
                description: `${user.prenom} ${user.nom} a été ajouté avec succès.`,
            })
        }

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

                <UserDataTable dummyUsers={users} searchQuery={searchQuery} statusFilter={statusFilter} canFetch={setCanFetch} />

                {isAddUserOpen && (
                    <AddUserDialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen} onSubmit={handleAddUser} />
                )}
            </div>
        </div>
    )
}

export default UserManagement

