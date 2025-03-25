"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn-ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Badge } from "@/components/shadcn-ui/badge"
import { Button } from "@/components/shadcn-ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu"
import { Input } from "@/components/shadcn-ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/select"
import { FileCheck, FileClock, FileWarning, MoreHorizontal, Search } from "lucide-react"

interface RecentDocumentsProps {
    showFilters?: boolean
}

export function RecentDocuments({ showFilters = false }: RecentDocumentsProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Données simulées pour les documents récents
    const documents = [
        {
            id: "DOC-2023-001",
            title: "Contrat de prestation de services",
            date: "2023-07-15",
            status: "signed",
            initiator: "Jean Dupont",
            signatories: ["Marie Martin", "Pierre Durand"],
        },
        {
            id: "DOC-2023-002",
            title: "Accord de confidentialité",
            date: "2023-07-18",
            status: "pending",
            initiator: "Sophie Lefebvre",
            signatories: ["Thomas Bernard", "Julie Petit"],
        },
        {
            id: "DOC-2023-003",
            title: "Contrat d'embauche",
            date: "2023-07-10",
            status: "late",
            initiator: "Philippe Moreau",
            signatories: ["Isabelle Dubois"],
        },
        {
            id: "DOC-2023-004",
            title: "Avenant au contrat",
            date: "2023-07-20",
            status: "signed",
            initiator: "Laurent Girard",
            signatories: ["Nathalie Rousseau"],
        },
        {
            id: "DOC-2023-005",
            title: "Procès-verbal de réunion",
            date: "2023-07-22",
            status: "pending",
            initiator: "Michel Leroy",
            signatories: ["Catherine Fournier", "David Mercier", "Sylvie Roux"],
        },
    ]

    // Filtrer les documents en fonction de la recherche et du statut
    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch =
            searchQuery === "" ||
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.id.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "signed" && doc.status === "signed") ||
            (statusFilter === "pending" && doc.status === "pending") ||
            (statusFilter === "late" && doc.status === "late")

        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "signed":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <FileCheck className="h-3 w-3 mr-1" />
                        Signé
                    </Badge>
                )
            case "pending":
                return (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <FileClock className="h-3 w-3 mr-1" />
                        En attente
                    </Badge>
                )
            case "late":
                return (
                    <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                        <FileWarning className="h-3 w-3 mr-1" />
                        En retard
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle>Documents récents</CardTitle>
                        <CardDescription>Les derniers documents traités sur la plateforme</CardDescription>
                    </div>
                    {showFilters && (
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Rechercher..."
                                    className="w-[200px] pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="signed">Signés</SelectItem>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="late">En retard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Document</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Initiateur</TableHead>
                                <TableHead>Signataires</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocuments.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium">{doc.id}</TableCell>
                                    <TableCell>{doc.title}</TableCell>
                                    <TableCell>{new Date(doc.date).toLocaleDateString("fr-FR")}</TableCell>
                                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                                    <TableCell>{doc.initiator}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {doc.signatories.map((signatory, index) => (
                                                <Badge key={index} variant="secondary" className="font-normal">
                                                    {signatory}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                                <DropdownMenuItem>Télécharger</DropdownMenuItem>
                                                <DropdownMenuItem>Envoyer un rappel</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredDocuments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Aucun document trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

