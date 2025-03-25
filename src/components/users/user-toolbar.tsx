"use client"

import type React from "react"

import { Input } from "@/components/shadcn-ui/input"
import { Button } from "@/components/shadcn-ui/button"
import { Download, Upload, UserPlus, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/select"
import { useRef } from "react"

interface UserToolbarProps {
    onAddUser: () => void
    onImportUsers: (file: File) => void
    onDownloadTemplate: () => void
    searchQuery: string
    onSearchChange: (value: string) => void
    statusFilter: string
    onStatusFilterChange: (value: string) => void
}

export function UserToolbar({
                                onAddUser,
                                onImportUsers,
                                onDownloadTemplate,
                                searchQuery,
                                onSearchChange,
                                statusFilter,
                                onStatusFilterChange,
                            }: UserToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onImportUsers(file)
        }
        // Réinitialiser l'input pour permettre de sélectionner le même fichier
        if (e.target) {
            e.target.value = ""
        }
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="w-full sm:w-[250px] pl-8"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <Button variant="outline" size="sm" onClick={onDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Modèle YAML
                </Button>

                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer
                </Button>
                <input ref={fileInputRef} type="file" accept=".yaml,.yml" className="hidden" onChange={handleFileChange} />

                <Button size="sm" onClick={onAddUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter
                </Button>
            </div>
        </div>
    )
}

