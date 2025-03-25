"use client"

import { useState, useMemo, useCallback } from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn-ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn-ui/dropdown-menu"
import { Button } from "@/components/shadcn-ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn-ui/avatar"
import { Badge } from "@/components/shadcn-ui/badge"
import { EditUserDialog } from "./edit-user-dialog"
import { MoreHorizontal, Edit, UserX, UserCheck } from "lucide-react"
import type { AddUser } from "@/@types"
import { toast } from "sonner"

// Données fictives
const dummyUsers: AddUser[] = [
    { id: "1", prenom: "Jean", nom: "Dupont", email: "jean.dupont@example.com", password: "********", telephone: "0123456789", photo: "/placeholder.svg?height=40&width=40", cni: "1234567890", fonctionId: 1, fonctionNom: "Directeur", roles: ["ADMIN", "USER"], active: true },
    { id: "2", prenom: "Marie", nom: "Martin", email: "marie.martin@example.com", password: "********", telephone: "0987654321", photo: "/placeholder.svg?height=40&width=40", cni: "0987654321", fonctionId: 2, fonctionNom: "Responsable RH", roles: ["USER"], active: true },
    { id: "3", prenom: "Pierre", nom: "Durand", email: "pierre.durand@example.com", password: "********", telephone: "0567891234", photo: "/placeholder.svg?height=40&width=40", cni: "5678912340", fonctionId: 3, fonctionNom: "Développeur", roles: ["USER"], active: false },
]

interface UserDataTableProps {
    searchQuery: string
    statusFilter: string
}

export function UserDataTable({ searchQuery, statusFilter }: UserDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [editingUser, setEditingUser] = useState<AddUser | null>(null)
    // const { toast } = useToast()

    // Optimisation : éviter le recalcul des filtres à chaque rendu
    const filteredUsers = useMemo(() => {
        return dummyUsers.filter((user) => {
            const matchesSearch = searchQuery === "" ||
                `${user.prenom} ${user.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.cni?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.fonctionNom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.roles.join(", ").toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "active" && user.active) ||
                (statusFilter === "inactive" && !user.active)

            return matchesSearch && matchesStatus
        })
    }, [searchQuery, statusFilter])

    const handleToggleStatus = useCallback((user: AddUser) => {
        console.log(`Changement de statut pour ${user.prenom} ${user.nom}`)
        toast("Statut modifié",{
            description: `${user.prenom} ${user.nom} est maintenant ${user.active ? "inactif" : "actif"}.`,
        })
    }, [toast])

    const handleEditUser = useCallback((user: AddUser) => {
        setEditingUser(user)
    }, [])

    const handleUpdateUser = useCallback((updatedUser: AddUser) => {
        console.log("Mise à jour de l'utilisateur:", updatedUser)
        toast("Utilisateur mis à jour",{
            description: `${updatedUser.prenom} ${updatedUser.nom} a été mis à jour avec succès.`,
        })
        setEditingUser(null)
    }, [toast])

    const columns = useMemo<ColumnDef<AddUser>[]>(() => [
        {
            accessorKey: "photo",
            header: "",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <Avatar>
                        <AvatarImage src={user.photo} alt={`${user.prenom} ${user.nom}`} />
                        <AvatarFallback>{`${user.prenom.charAt(0)}${user.nom.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                )
            },
        },
        {
            accessorFn: (row) => `${row.prenom} ${row.nom}`,
            id: "fullName",
            header: "Nom complet",
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.prenom} {row.original.nom}</div>
                    <div className="text-sm text-muted-foreground">{row.original.email}</div>
                </div>
            ),
        },
        { accessorKey: "telephone", header: "Téléphone" },
        { accessorKey: "fonctionNom", header: "Fonction" },
        {
            accessorKey: "roles",
            header: "Rôles",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.roles.map((role) => (
                        <Badge key={role} variant="outline">{role}</Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "active",
            header: "Statut",
            cell: ({ row }) => <Badge variant={row.original.active ? "success" : "destructive"}>{row.original.active ? "Actif" : "Inactif"}</Badge>,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(row.original)}>
                            <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(row.original)}>
                            {row.original.active ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                            {row.original.active ? "Désactiver" : "Activer"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ], [handleEditUser, handleToggleStatus])

    const table = useReactTable({
        data: filteredUsers,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, columnFilters },
    })

    return (
        <div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => <TableCell
                                key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                </div>
                <Button variant="outline" size="sm" onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                    Précédent
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Suivant
                </Button>
            </div>
            {editingUser &&
                <EditUserDialog user={editingUser} open onOpenChange={(open) => !open && setEditingUser(null)}
                                onSubmit={handleUpdateUser} />}
        </div>
    )
}
