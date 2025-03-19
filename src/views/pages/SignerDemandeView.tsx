import React, { useEffect, useRef, useState } from "react"
import { Check, FileText, Pen } from "lucide-react"

import { Button } from "@/components/shadcn-ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Label } from "@/components/shadcn-ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/shadcn-ui/radio-group"
import { cn } from "@/lib/utils"
import { Meta } from '@/@types/routes'
import { Button as ButtonDefault } from '@/components/ui/Button'
import { useParams } from 'react-router-dom'

// interface DocumentViewerProps extends Meta{
//     documentId: string
// }

type SignatureType = "biometrique" | "electronique"
// { documentId }: DocumentViewerProps
export default function SignerDemandeView() {
    const [signatureType, setSignatureType] = useState<SignatureType>("electronique")
    const [isLoading, setIsLoading] = useState(true)
    const [documentTitle, setDocumentTitle] = useState("")
    const viewerRef = useRef<HTMLDivElement>(null)
    const [instance, setInstance] = useState<any>(null)
    const { documentId } = useParams();
    console.log(documentId)
    // Simuler le chargement des données du document
    useEffect(() => {
        const fetchDocumentData = async () => {
            // Simulation d'une requête API
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Données fictives
            setDocumentTitle(`Document #${documentId}`)
            setIsLoading(false)
        }

        fetchDocumentData()
    }, [documentId])

    // Initialiser WebViewer
    useEffect(() => {
        const initWebViewer = async () => {
            if (viewerRef.current && !instance) {
                try {
                    // Importer WebViewer dynamiquement
                    const WebViewer = (await import("@pdftron/webviewer")).default

                    const webViewerInstance = await WebViewer(
                        {
                            path: "/webviewer/lib", // Chemin vers les fichiers WebViewer
                            initialDoc: `/documents/sample-${documentId}.pdf`, // Document à afficher
                            licenseKey: "votre-clé-de-licence", // Remplacer par votre clé de licence
                            fullAPI: true,
                            enableAnnotations: true,
                        },
                        viewerRef.current,
                    )

                    setInstance(webViewerInstance)

                    // Configurer WebViewer après initialisation
                    const { documentViewer, annotationManager } = webViewerInstance.Core

                    documentViewer.addEventListener("documentLoaded", () => {
                        console.log("Document chargé avec succès")
                    })
                } catch (error) {
                    console.error("Erreur lors de l'initialisation de WebViewer:", error)
                }
            }
        }

        if (!isLoading) {
            initWebViewer()
        }

        // Nettoyage lors du démontage du composant
        return () => {
            if (instance) {
                instance.Core.documentViewer.closeDocument()
            }
        }
    }, [isLoading, documentId, instance])

    const handleSignatureTypeChange = (value: string) => {
        setSignatureType(value as SignatureType)
    }

    const handleSendDocument = () => {
        console.log(`Document envoyé avec signature ${signatureType}`)
        // Logique d'envoi du document signé
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Panneau de gauche - Options de signature */}
            <div className="lg:col-span-1">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            <span>Type de signature</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <RadioGroup value={signatureType} onValueChange={handleSignatureTypeChange} className="space-y-4">
                            <div className="flex items-start space-x-3 space-y-0">
                                <RadioGroupItem value="biometrique" id="biometrique" />
                                <div className="grid gap-1.5">
                                    <Label htmlFor="biometrique" className="font-medium">
                                        Biométrique
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Signature manuscrite capturée sur un appareil tactile</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 space-y-0">
                                <RadioGroupItem value="electronique" id="electronique" />
                                <div className="grid gap-1.5">
                                    <Label htmlFor="electronique" className="font-medium">
                                        Électronique
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Signature électronique avec certificat numérique</p>
                                </div>
                            </div>
                        </RadioGroup>

                        <div className="mt-8">
                            <h3 className="text-sm font-medium mb-2">Aperçu de la signature</h3>
                            <div
                                className={cn(
                                    "flex items-center justify-center border rounded-md p-4 h-24",
                                    signatureType === "biometrique" ? "bg-gray-50" : "",
                                )}
                            >
                                {signatureType === "biometrique" ? (
                                    <div className="text-center text-muted-foreground">
                                        <Pen className="h-5 w-5 mx-auto mb-1" />
                                        <span className="text-xs">Signature manuscrite</span>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <Check className="h-5 w-5 mx-auto mb-1" />
                                        <span className="text-xs">Signature électronique</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="">
                        <ButtonDefault className="bg-blue-500 w-full text-white hover:bg-blue-400 hover:text-white hover:border-none hover:ring-0">
                            Envoyer
                        </ButtonDefault>
                    </CardFooter>
                </Card>
            </div>

            {/* Panneau de droite - Visualiseur PDF */}
            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader className="border-b">
                        <CardTitle>{documentTitle || "Chargement du document..."}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 h-[calc(100vh-16rem)]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div ref={viewerRef} className="h-full w-full" />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
