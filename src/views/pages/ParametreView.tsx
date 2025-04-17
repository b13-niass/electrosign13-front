import { useState, useEffect } from "react"
import archiveService, { type ArchiveResult, type ArchiveStats } from "@/services/ArchiveService"
import { Button } from "@/components/shadcn-ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn-ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn-ui/tabs"
import { Separator } from "@/components/shadcn-ui/separator"
import { Badge } from "@/components/shadcn-ui/badge"
import { ScrollArea } from "@/components/shadcn-ui/scroll-area"
import { CheckCircle, XCircle, Archive, FileArchive, Settings, RefreshCw } from "lucide-react"

export default function PaametreView() {
    const [isArchiving, setIsArchiving] = useState(false)
    const [archiveResult, setArchiveResult] = useState<ArchiveResult | null>(null)
    const [stats, setStats] = useState<ArchiveStats | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = async () => {
        try {
            const result = await archiveService.getArchiveStats()
            if (result.status == "OK") {
                setStats(result.data)
            }
        } catch (err) {
            setError("Erreur lors de la récupération des statistiques")
            console.error(err)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const handleArchive = async () => {
        setIsArchiving(true)
        setError(null)

        try {
            const result = await archiveService.archiveDocuments()
            if (result.status == "OK") {
                setArchiveResult(result.data)
            }
            // Refresh stats after archiving
            fetchStats()
        } catch (err) {
            setError("Erreur lors de l'archivage des documents")
            console.error(err)
        } finally {
            setIsArchiving(false)
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Paramètres</h1>
                <Settings className="h-8 w-8 text-gray-500" />
            </div>

            <Tabs defaultValue="archive" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="archive">Archivage</TabsTrigger>
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="archive" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Archive className="h-5 w-5" />
                                Archivage des documents
                            </CardTitle>
                            <CardDescription>
                                Archivez les documents signés vers Cloudinary pour libérer de l&apos;espace et sécuriser vos données.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Documents signés non Archiver</p>
                                        <p className="text-2xl font-bold">{stats?.signedDocuments || 0}</p>
                                    </div>
                                    <FileArchive className="h-10 w-10 text-blue-500" />
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Documents signer archivés</p>
                                        <p className="text-2xl font-bold">{stats?.archivedDocuments || 0}</p>
                                    </div>
                                    <Archive className="h-10 w-10 text-green-500" />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    onClick={handleArchive}
                                    disabled={isArchiving || stats?.signedDocuments === 0}
                                    className="w-full md:w-auto"
                                >
                                    {isArchiving ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Archivage en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Archive className="mr-2 h-4 w-4" />
                                            Archiver les documents signés
                                        </>
                                    )}
                                </Button>
                            </div>

                            {error && (
                                <Alert variant="destructive" className="mt-6">
                                    <XCircle className="h-4 w-4" />
                                    <AlertTitle>Erreur</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {archiveResult && (
                                <div className="mt-6">
                                    <Alert variant={archiveResult.failedToArchive.length === 0 ? "default" : "destructive"}>
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertTitle>Résultat de l&apos;archivage</AlertTitle>
                                        <AlertDescription>
                                            {archiveResult.totalDocuments} documents traités, {archiveResult.successfullyArchived.length}{" "}
                                            archivés avec succès
                                            {archiveResult.failedToArchive.length > 0 && `, ${archiveResult.failedToArchive.length} échecs`}.
                                        </AlertDescription>
                                    </Alert>

                                    {(archiveResult.successfullyArchived.length > 0 || archiveResult.failedToArchive.length > 0) && (
                                        <div className="mt-4 space-y-4">
                                            {archiveResult.successfullyArchived.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-medium mb-2 flex items-center">
                                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                        Documents archivés avec succès
                                                    </h3>
                                                    <ScrollArea className="h-32 w-full rounded border p-2">
                                                        <div className="flex flex-wrap gap-2">
                                                            {archiveResult.successfullyArchived.map((doc, index) => (
                                                                <Badge key={index} variant="outline" className="bg-green-50">
                                                                    {doc}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            )}

                                            {archiveResult.failedToArchive.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-medium mb-2 flex items-center">
                                                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                                        Documents non archivés
                                                    </h3>
                                                    <ScrollArea className="h-32 w-full rounded border p-2">
                                                        <div className="flex flex-wrap gap-2">
                                                            {archiveResult.failedToArchive.map((doc, index) => (
                                                                <Badge key={index} variant="outline" className="bg-red-50">
                                                                    {doc}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col items-start">
                            <p className="text-sm text-slate-500">
                                L&apos;archivage déplace les documents signés vers Cloudinary et libère de l&apos;espace sur le serveur local.
                            </p>
                        </CardFooter>
                    </Card>

                    {/*<Card>*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle>Paramètres d&apos;archivage</CardTitle>*/}
                    {/*        <CardDescription>*/}
                    {/*            Configurez les options d&apos;archivage automatique et de rétention des documents.*/}
                    {/*        </CardDescription>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <div className="space-y-4">*/}
                    {/*            <div className="flex items-center justify-between">*/}
                    {/*                <div>*/}
                    {/*                    <h3 className="font-medium">Archivage automatique</h3>*/}
                    {/*                    <p className="text-sm text-slate-500">Archiver automatiquement les documents après signature</p>*/}
                    {/*                </div>*/}
                    {/*                <Button variant="outline">Configurer</Button>*/}
                    {/*            </div>*/}

                    {/*            <Separator />*/}

                    {/*            <div className="flex items-center justify-between">*/}
                    {/*                <div>*/}
                    {/*                    <h3 className="font-medium">Politique de rétention</h3>*/}
                    {/*                    <p className="text-sm text-slate-500">Définir la durée de conservation des documents archivés</p>*/}
                    {/*                </div>*/}
                    {/*                <Button variant="outline">Configurer</Button>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </TabsContent>

                <TabsContent value="general" className="mt-6">
                    {/*<Card>*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle>Paramètres généraux</CardTitle>*/}
                    {/*        <CardDescription>Configurez les paramètres généraux de l&apos;application.</CardDescription>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <p className="text-slate-500">Cette section est en cours de développement.</p>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                    {/*<Card>*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle>Paramètres de notifications</CardTitle>*/}
                    {/*        <CardDescription>Configurez les notifications par email et dans l&apos;application.</CardDescription>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <p className="text-slate-500">Cette section est en cours de développement.</p>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </TabsContent>
            </Tabs>
        </div>
    )
}
