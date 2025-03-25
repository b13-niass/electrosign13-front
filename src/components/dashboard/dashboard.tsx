"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn-ui/tabs"
import { StatCards } from "./stat-cards"
import { DocumentsChart } from "./documents-chart"
import { RecentDocuments } from "./recent-documents"
import { SignatureProgress } from "./signature-progress"
import { DateRangePicker } from "./date-range-picker"
import { addDays, format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, FileCheck, FileWarning, FileClock, Users } from "lucide-react"
import { DateRange } from 'react-day-picker'

export default function Dashboard() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    })

    // Données simulées pour les statistiques
    const stats = {
        signed: 247,
        pending: 58,
        late: 12,
        totalUsers: 85,
        signedPercentage: 78,
        pendingPercentage: 18,
        latePercentage: 4,
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">Vue d&apos;ensemble</h2>
                <DateRangePicker date={date} setDate={setDate} />
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <StatCards stats={stats} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Évolution des documents</CardTitle>
                                <CardDescription>
                                    {format(date!.from!, "d MMMM yyyy", { locale: fr })} -{" "}
                                    {date!.to ? format(date!.to, "d MMMM yyyy", { locale: fr }) : "Aujourd'hui"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DocumentsChart />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Progression des signatures</CardTitle>
                                <CardDescription>Répartition des statuts de documents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SignatureProgress stats={stats} />
                            </CardContent>
                        </Card>
                    </div>

                    <RecentDocuments />
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Documents signés</CardTitle>
                                <FileCheck className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.signed}</div>
                                <p className="text-xs text-muted-foreground">
                                    +{Math.floor(Math.random() * 20)}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Documents en attente</CardTitle>
                                <FileClock className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pending}</div>
                                <p className="text-xs text-muted-foreground">
                                    {Math.floor(Math.random() * 10) - 5}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Documents en retard</CardTitle>
                                <FileWarning className="h-4 w-4 text-pink-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.late}</div>
                                <p className="text-xs text-muted-foreground">
                                    {Math.floor(Math.random() * 10) - 2}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Détails des documents</CardTitle>
                            <CardDescription>Analyse détaillée des documents par statut</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DocumentsChart showLegend={true} height={350} />
                        </CardContent>
                    </Card>

                    <RecentDocuments showFilters={true} />
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                                <Users className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                <p className="text-xs text-muted-foreground">
                                    +{Math.floor(Math.random() * 10)}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
                                <CalendarIcon className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.signedPercentage}%</div>
                                <p className="text-xs text-muted-foreground">
                                    +{Math.floor(Math.random() * 5)}% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activité des utilisateurs</CardTitle>
                            <CardDescription>Nombre de documents traités par utilisateur</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            {/* Ici, vous pourriez ajouter un graphique d'activité des utilisateurs */}
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Graphique d&apos;activité des utilisateurs
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

