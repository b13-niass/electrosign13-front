import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Check, Download, Eye, FileText, Filter, X } from "lucide-react"

import { Button } from "@/components/shadcn-ui/button"
import { Calendar } from "@/components/shadcn-ui/calendar"
import { Checkbox } from "@/components/shadcn-ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu"
import { Input } from "@/components/shadcn-ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn-ui/table"
import { Badge } from "@/components/shadcn-ui/badge"
import { cn } from "@/lib/utils"
import { Link } from 'react-router-dom'

// Types
export type SignatureStatus = "en_attente" | "signé" | "rejeté"

export type Participant = {
    id: string
    name: string
    email: string
    role: "signataire" | "approbateur"
    hasSigned: boolean
}

export type SignatureRequest = {
    id: string
    title: string
    dateCreated: Date
    status: SignatureStatus
    documentUrl: string
    participants: Participant[]
}

// Données d'exemple
const data: SignatureRequest[] = [
    {
        id: "SR001",
        title: "Contrat de prestation de services",
        dateCreated: new Date(2025, 2, 15),
        status: "en_attente",
        documentUrl: "/documents/contrat-services.pdf",
        participants: [
            { id: "P1", name: "Marie Dupont", email: "marie.dupont@example.com", role: "signataire", hasSigned: true },
            { id: "P2", name: "Jean Martin", email: "jean.martin@example.com", role: "signataire", hasSigned: false },
            { id: "P3", name: "Sophie Leclerc", email: "sophie.leclerc@example.com", role: "approbateur", hasSigned: true },
        ],
    },
    {
        id: "SR002",
        title: "Accord de confidentialité",
        dateCreated: new Date(2025, 2, 10),
        status: "signé",
        documentUrl: "/documents/nda.pdf",
        participants: [
            { id: "P4", name: "Thomas Bernard", email: "thomas.bernard@example.com", role: "signataire", hasSigned: true },
            { id: "P5", name: "Camille Petit", email: "camille.petit@example.com", role: "signataire", hasSigned: true },
            { id: "P6", name: "Lucas Moreau", email: "lucas.moreau@example.com", role: "approbateur", hasSigned: true },
        ],
    },
    {
        id: "SR003",
        title: "Contrat d'embauche",
        dateCreated: new Date(2025, 2, 5),
        status: "rejeté",
        documentUrl: "/documents/contrat-embauche.pdf",
        participants: [
            { id: "P7", name: "Emma Dubois", email: "emma.dubois@example.com", role: "signataire", hasSigned: false },
            { id: "P8", name: "Léo Richard", email: "leo.richard@example.com", role: "approbateur", hasSigned: false },
        ],
    },
    {
        id: "SR004",
        title: "Avenant au contrat",
        dateCreated: new Date(2025, 2, 1),
        status: "en_attente",
        documentUrl: "/documents/avenant.pdf",
        participants: [
            { id: "P9", name: "Julie Lambert", email: "julie.lambert@example.com", role: "signataire", hasSigned: true },
            {
                id: "P10",
                name: "Nicolas Fournier",
                email: "nicolas.fournier@example.com",
                role: "signataire",
                hasSigned: false,
            },
        ],
    },
    {
        id: "SR005",
        title: "Procès-verbal de réunion",
        dateCreated: new Date(2025, 1, 25),
        status: "signé",
        documentUrl: "/documents/pv-reunion.pdf",
        participants: [
            { id: "P11", name: "Aurélie Morel", email: "aurelie.morel@example.com", role: "signataire", hasSigned: true },
            { id: "P12", name: "Pierre Leroy", email: "pierre.leroy@example.com", role: "signataire", hasSigned: true },
            {
                id: "P13",
                name: "Isabelle Girard",
                email: "isabelle.girard@example.com",
                role: "approbateur",
                hasSigned: true,
            },
        ],
    },
    {
        id: "SR006",
        title: "Bon de commande",
        dateCreated: new Date(2025, 1, 20),
        status: "en_attente",
        documentUrl: "/documents/bon-commande.pdf",
        participants: [
            { id: "P14", name: "David Mercier", email: "david.mercier@example.com", role: "signataire", hasSigned: false },
            { id: "P15", name: "Céline Roux", email: "celine.roux@example.com", role: "approbateur", hasSigned: true },
        ],
    },
    {
        id: "SR007",
        title: "Contrat de bail",
        dateCreated: new Date(2025, 1, 15),
        status: "signé",
        documentUrl: "/documents/contrat-bail.pdf",
        participants: [
            { id: "P16", name: "Mathieu Vincent", email: "mathieu.vincent@example.com", role: "signataire", hasSigned: true },
            { id: "P17", name: "Laura Simon", email: "laura.simon@example.com", role: "signataire", hasSigned: true },
        ],
    },
    {
        id: "SR008",
        title: "Attestation de travail",
        dateCreated: new Date(2025, 1, 10),
        status: "en_attente",
        documentUrl: "/documents/attestation.pdf",
        participants: [
            { id: "P18", name: "Antoine Durand", email: "antoine.durand@example.com", role: "signataire", hasSigned: false },
            {
                id: "P19",
                name: "Nathalie Michel",
                email: "nathalie.michel@example.com",
                role: "approbateur",
                hasSigned: false,
            },
        ],
    },
    {
        id: "SR009",
        title: "Contrat de partenariat",
        dateCreated: new Date(2025, 1, 5),
        status: "rejeté",
        documentUrl: "/documents/partenariat.pdf",
        participants: [
            {
                id: "P20",
                name: "François Lefebvre",
                email: "francois.lefebvre@example.com",
                role: "signataire",
                hasSigned: false,
            },
            {
                id: "P21",
                name: "Sandrine Bertrand",
                email: "sandrine.bertrand@example.com",
                role: "signataire",
                hasSigned: false,
            },
        ],
    },
    {
        id: "SR010",
        title: "Accord de licence",
        dateCreated: new Date(2025, 1, 1),
        status: "signé",
        documentUrl: "/documents/licence.pdf",
        participants: [
            { id: "P22", name: "Julien Rousseau", email: "julien.rousseau@example.com", role: "signataire", hasSigned: true },
            { id: "P23", name: "Caroline Blanc", email: "caroline.blanc@example.com", role: "approbateur", hasSigned: true },
        ],
    },
]

// Fonction pour obtenir le statut traduit
function getStatusLabel(status: SignatureStatus): string {
    switch (status) {
        case "en_attente":
            return "En attente"
        case "signé":
            return "Signé"
        case "rejeté":
            return "Rejeté"
        default:
            return status
    }
}

// Fonction pour obtenir la couleur du badge selon le statut
function getStatusColor(status: SignatureStatus): string {
    switch (status) {
        case "en_attente":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        case "signé":
            return "bg-green-100 text-green-800 hover:bg-green-100"
        case "rejeté":
            return "bg-red-100 text-red-800 hover:bg-red-100"
        default:
            return ""
    }
}

// Définition des colonnes
export const columns: ColumnDef<SignatureRequest>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Sélectionner tout"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                aria-label="Sélectionner la ligne"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Document",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{row.getValue("title")}</span>
            </div>
        ),
    },
    {
        accessorKey: "dateCreated",
        header: "Date de création",
        cell: ({ row }) => {
            const date = row.getValue("dateCreated") as Date
            if (!date) return "Date invalide" // Fallback for invalid dates
            return format(date, "dd MMMM yyyy", { locale: fr }) || "Date invalide"
        },
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
            const status = row.getValue("status") as SignatureStatus
            return (
                <Badge variant="outline" className={getStatusColor(status)}>
                    {getStatusLabel(status)}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            const status = row.getValue(id) as string
            return status === value
        },
    },
    {
        accessorKey: "participants",
        header: "Participants",
        cell: ({ row }) => {
            const participants = row.getValue("participants") as Participant[] || []

            return (
                <div className="flex flex-col gap-1">
                    <div className="text-xs font-medium">Signataires:</div>
                    <div className="flex flex-wrap gap-1">
                        {participants
                            .filter((p) => p.role === "signataire")
                            .map((participant) => (
                                <Badge
                                    key={participant.id}
                                    variant="outline"
                                    className={cn("text-xs", participant.hasSigned ? "bg-green-100 text-green-800" : "bg-gray-100")}
                                >
                                    {participant.name}
                                    {participant.hasSigned && <Check className="ml-1 h-3 w-3" />}
                                </Badge>
                            ))}
                    </div>

                    {participants.some((p) => p.role === "approbateur") && (
                        <>
                            <div className="text-xs font-medium mt-1">Approbateurs:</div>
                            <div className="flex flex-wrap gap-1">
                                {participants
                                    .filter((p) => p.role === "approbateur")
                                    .map((participant) => (
                                        <Badge
                                            key={participant.id}
                                            variant="outline"
                                            className={cn("text-xs", participant.hasSigned ? "bg-green-100 text-green-800" : "bg-gray-100")}
                                        >
                                            {participant.name}
                                            {participant.hasSigned && <Check className="ml-1 h-3 w-3" />}
                                        </Badge>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const document = row.original
            return (
                <div className="flex items-center gap-2">
                    <Link to='/signer-demande/1' >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <Button variant="ghost" size="icon" title="Télécharger le document">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]

export default function DemandeView() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [statusFilter, setStatusFilter] = React.useState<string>("all")
    const [dateRange, setDateRange] = React.useState<Date | undefined>(undefined)
    React.useRef(null)
// Filtrer les données en fonction du statut sélectionné
    React.useEffect(() => {
        if (statusFilter === "all") {
            table.getColumn("status")?.setFilterValue(undefined)
        } else {
            table.getColumn("status")?.setFilterValue([statusFilter])
        }
    }, [statusFilter])

    // Filtrer les données en fonction de la date sélectionnée
    React.useEffect(() => {
        if (dateRange) {
            const formattedDate = format(dateRange, "yyyy-MM-dd")
            table.getColumn("dateCreated")?.setFilterValue(formattedDate)
        } else {
            table.getColumn("dateCreated")?.setFilterValue(undefined)
        }
    }, [dateRange])

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    })

    // Fonction pour télécharger les documents sélectionnés
    const downloadSelected = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        console.log(
            "Téléchargement des documents sélectionnés:",
            selectedRows.map((row) => row.original.title),
        )
        // Logique de téléchargement ici
    }

    return (
        <div className="space-y-4 bg-white p-4 rounded-2xl border-1 border-gray-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Rechercher..."
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => table.getColumn("title")?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="signé">Signé</SelectItem>
                            <SelectItem value="rejeté">Rejeté</SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("w-[240px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange ? format(dateRange, "dd MMMM yyyy", { locale: fr }) : "Filtrer par date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={dateRange} onSelect={setDateRange} initialFocus />
                        </PopoverContent>
                    </Popover>

                    {dateRange && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDateRange(undefined)}
                            title="Effacer le filtre de date"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                <Filter className="mr-2 h-4 w-4" />
                                Colonnes
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id === "title"
                                                ? "Document"
                                                : column.id === "dateCreated"
                                                    ? "Date de création"
                                                    : column.id === "status"
                                                        ? "Statut"
                                                        : column.id === "participants"
                                                            ? "Participants"
                                                            : column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        onClick={downloadSelected}
                        disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-gray-200">
                <Table className="!border-1 !border-gray-50">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucune demande de signature trouvée.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} document(s)
                    sélectionné(s).
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Précédent
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    )
}

