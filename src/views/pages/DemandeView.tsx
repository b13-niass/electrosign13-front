"use client"
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
import { CalendarIcon, Check, Download, Eye, FileText, Filter, X, Clock } from "lucide-react"

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
import { Link } from "react-router-dom"
import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { CustomTab, CustomTabs } from "@/components/ui/CustomTabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn-ui/tooltip"
import { toast } from "sonner"
import type { SignatureRequest, SignatureStatus } from "@/@types"
import DemandeService from "@/services/DemandeService"

// Fonction pour obtenir le statut traduit
function getStatusLabel(status: SignatureStatus): string {
    switch (status) {
        case "EN_ATTENTE_APPROBATION":
            return "En attente d'approbation"
        case "APPROUVEE":
            return "Approuvée"
        case "EN_ATTENTE_SIGNATURE":
            return "En attente de signature"
        case "SIGNEE":
            return "Signée"
        case "REFUSEE":
            return "Refusée"
        case "ANNULEE":
            return "Annulée"
        default:
            return status
    }
}

// Fonction pour obtenir la couleur du badge selon le statut
function getStatusColor(status: SignatureStatus): string {
    switch (status) {
        case "EN_ATTENTE_APPROBATION":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100"
        case "APPROUVEE":
            return "bg-teal-100 text-teal-800 hover:bg-teal-100"
        case "EN_ATTENTE_SIGNATURE":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        case "SIGNEE":
            return "bg-green-100 text-green-800 hover:bg-green-100"
        case "REFUSEE":
            return "bg-red-100 text-red-800 hover:bg-red-100"
        case "ANNULEE":
            return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        default:
            return ""
    }
}

// Fonction pour obtenir la couleur du badge selon la priorité
function getPriorityColor(priority: string): string {
    switch (priority) {
        case "FAIBLE":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100"
        case "MOYENNE":
            return "bg-orange-100 text-orange-800 hover:bg-orange-100"
        case "HAUTE":
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
        accessorKey: "titre",
        header: "Document",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{row.getValue("titre")}</span>
            </div>
        ),
    },
    {
        accessorKey: "dateCreated",
        header: "Date de création",
        cell: ({ row }) => {
            const date = row.getValue("dateCreated") as Date
            if (!date) return "Date invalide" // Fallback for invalid dates
            return format(new Date(date), "dd MMMM yyyy", { locale: fr }) || "Date invalide"
        },
    },
    {
        accessorKey: "dateLimite",
        header: "Date limite",
        cell: ({ row }) => {
            const date = row.getValue("dateLimite") as Date
            if (!date) return "Non définie" // Fallback for invalid dates
            return format(new Date(date), "dd MMMM yyyy", { locale: fr }) || "Date invalide"
        },
    },
    {
        accessorKey: "priority",
        header: "Priorité",
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string
            return (
                <Badge variant="outline" className={getPriorityColor(priority)}>
                    {priority}
                </Badge>
            )
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
        accessorKey: "signataires",
        header: "Participants",
        cell: ({ row }) => {
            const signataires = row.original.signataires || []
            const approbateurs = row.original.approbateurs || []
            const ampliateurs = row.original.ampliateurs || []

            return (
                <div className="flex flex-col gap-1">
                    {signataires.length > 0 && (
                        <>
                            <div className="text-xs font-medium">Signataires:</div>
                            <div className="flex flex-wrap gap-1">
                                {signataires.map((participant) => (
                                    <TooltipProvider key={participant.id}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs flex items-center gap-1",
                                                        participant.hasSigned
                                                            ? "bg-green-100 text-green-800"
                                                            : participant.currentSigner
                                                                ? "!bg-yellow-100 !text-yellow-800 !border-yellow-400 !border-2"
                                                                : `bg-gray-100 ${participant.currentSigner}`,
                                                    )}
                                                >
                                                    <span className="font-bold mr-1">{participant.ordre}.</span>
                                                    {participant.name}
                                                    {participant.hasSigned && <Check className="h-3 w-3" />}
                                                    {participant.currentSigner && <Clock className="h-3 w-3" />}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{participant.email}</p>
                                                <p>Ordre: {participant.ordre}</p>
                                                <p>
                                                    {participant.hasSigned
                                                        ? "Signé"
                                                        : participant.currentSigner
                                                            ? "En attente de signature (actuel)"
                                                            : "En attente de signature"}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </>
                    )}

                    {approbateurs.length > 0 && (
                        <>
                            <div className="text-xs font-medium mt-1">Approbateurs:</div>
                            <div className="flex flex-wrap gap-1">
                                {approbateurs.map((participant) => (
                                    <TooltipProvider key={participant.id}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs flex items-center gap-1",
                                                        participant.hasSigned
                                                            ? "bg-green-100 text-green-800"
                                                            : participant.currentSigner
                                                                ? "!bg-yellow-100 text-yellow-800 border-yellow-400 border-2"
                                                                : "bg-gray-100",
                                                    )}
                                                >
                                                    <span className="font-bold mr-1">{participant.ordre}.</span>
                                                    {participant.name}
                                                    {participant.hasSigned && <Check className="h-3 w-3" />}
                                                    {participant.currentSigner && <Clock className="h-3 w-3" />}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{participant.email}</p>
                                                <p>Ordre: {participant.ordre}</p>
                                                <p>
                                                    {participant.hasSigned
                                                        ? "Approuvé"
                                                        : participant.currentSigner
                                                            ? "En attente d'approbation (actuel)"
                                                            : "En attente d'approbation"}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </>
                    )}

                    {ampliateurs.length > 0 && (
                        <>
                            <div className="text-xs font-medium mt-1">Ampliateurs:</div>
                            <div className="flex flex-wrap gap-1">
                                {ampliateurs.map((participant) => (
                                    <TooltipProvider key={participant.id}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs",
                                                        participant.hasSigned ? "bg-green-100 text-green-800" : "bg-gray-100",
                                                    )}
                                                >
                                                    <span className="font-bold mr-1">{participant.ordre}.</span>
                                                    {participant.name}
                                                    {participant.hasSigned && <Check className="h-3 w-3" />}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{participant.email}</p>
                                                <p>Ordre: {participant.ordre}</p>
                                                <p>{participant.hasSigned ? "Amplifié" : "En attente d'ampliation"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
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
            const canSign = document.isCurrentUserSigner && document.status === "EN_ATTENTE_SIGNATURE"
            const canApprove = document.isCurrentUserApprobateur && document.status === "EN_ATTENTE_APPROBATION"

            return (
                <div className="flex items-center gap-2">
                    <Link to={`/signer-demande/${document.id}`}>
                        <Button
                            variant={canSign || canApprove ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                                canSign ? "bg-blue-500 hover:bg-blue-600" : "",
                                canApprove ? "bg-teal-500 hover:bg-teal-600" : "",
                            )}
                            title={
                                canSign
                                    ? "Votre signature est requise"
                                    : canApprove
                                        ? "Votre approbation est requise"
                                        : "Voir le document"
                            }
                        >
                            {canSign ? "Signer" : canApprove ? "Approuver" : <Eye className="h-4 w-4" />}
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" title="Télécharger le document">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]

// Composant pour la table des demandes
function DemandeTable({ data }: { data: SignatureRequest[] }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [dateRange, setDateRange] = useState<Date | undefined>(undefined)
    // const tableRef = useRef(null)

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

    // Filtrer les données en fonction du statut sélectionné
    useEffect(() => {
        if (statusFilter === "all") {
            table.getColumn("status")?.setFilterValue(undefined)
        } else {
            table.getColumn("status")?.setFilterValue(statusFilter)
        }
    }, [statusFilter, table])

    // Filtrer les données en fonction de la date sélectionnée
    useEffect(() => {
        if (dateRange) {
            const formattedDate = format(dateRange, "yyyy-MM-dd")
            table.getColumn("dateCreated")?.setFilterValue(formattedDate)
        } else {
            table.getColumn("dateCreated")?.setFilterValue(undefined)
        }
    }, [dateRange, table])

    // Fonction pour télécharger les documents sélectionnés
    const downloadSelected = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        console.log(
            "Téléchargement des documents sélectionnés:",
            selectedRows.map((row) => row.original.titre),
        )
        // Logique de téléchargement ici
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Rechercher..."
                        value={(table.getColumn("titre")?.getFilterValue() as string) ?? ""}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            table.getColumn("titre")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="EN_ATTENTE_APPROBATION">En attente d&apos;approbation</SelectItem>
                            <SelectItem value="APPROUVEE">Approuvée</SelectItem>
                            <SelectItem value="EN_ATTENTE_SIGNATURE">En attente de signature</SelectItem>
                            <SelectItem value="SIGNEE">Signée</SelectItem>
                            <SelectItem value="REFUSEE">Refusée</SelectItem>
                            <SelectItem value="ANNULEE">Annulée</SelectItem>
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
                                            {column.id === "titre"
                                                ? "Document"
                                                : column.id === "dateCreated"
                                                    ? "Date de création"
                                                    : column.id === "dateLimite"
                                                        ? "Date limite"
                                                        : column.id === "status"
                                                            ? "Statut"
                                                            : column.id === "priority"
                                                                ? "Priorité"
                                                                : column.id === "signataires"
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

export default function DemandeView() {
    const [activeTab, setActiveTab] = useState("received")
    const [receivedData, setReceivedData] = useState<SignatureRequest[]>([])
    const [sentData, setSentData] = useState<SignatureRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [receivedResponse, sentResponse] = await Promise.all([
                    DemandeService.getDemandesRecues(),
                    DemandeService.getDemandesEnvoyees(),
                ])
                if (receivedResponse.status !== "OK" || sentResponse.status !== "OK") {
                    throw new Error("Erreur lors du chargement des données des demandes")
                }
                console.log(receivedResponse.data)
                setReceivedData(receivedResponse.data)
                setSentData(sentResponse.data)
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error)
                toast.error("Impossible de charger les données des demandes")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="space-y-4 bg-white p-4 rounded-2xl border-1 border-gray-200">
            <CustomTabs className="mb-4">
                <CustomTab value="received" isActive={activeTab === "received"} onClick={setActiveTab}>
                    Demandes reçues ({receivedData.length})
                </CustomTab>
                <CustomTab value="sent" isActive={activeTab === "sent"} onClick={setActiveTab}>
                    Demandes envoyées ({sentData.length})
                </CustomTab>
            </CustomTabs>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {activeTab === "received" && <DemandeTable data={receivedData} />}
                    {activeTab === "sent" && <DemandeTable data={sentData} />}
                </>
            )}
        </div>
    )
}

