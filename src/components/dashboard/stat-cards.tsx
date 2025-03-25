import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { FileCheck, FileClock, FileWarning, Users } from "lucide-react"

interface StatCardsProps {
    stats: {
        signed: number
        pending: number
        late: number
        totalUsers: number
    }
}

export function StatCards({ stats }: StatCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documents signés</CardTitle>
                    <FileCheck className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.signed}</div>
                    <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20)}% depuis le mois dernier</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documents en attente</CardTitle>
                    <FileClock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 10) - 5}% depuis le mois dernier</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documents en retard</CardTitle>
                    <FileWarning className="h-4 w-4 text-pink-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.late}</div>
                    <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 10) - 2}% depuis le mois dernier</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10)}% depuis le mois dernier</p>
                </CardContent>
            </Card>
        </div>
    )
}

