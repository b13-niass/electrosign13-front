import { useEffect, useRef, useState } from 'react'
import { Check, FileText, Pen, ThumbsUp } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Label } from "@/components/shadcn-ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/shadcn-ui/radio-group"
import { cn } from "@/lib/utils"
import { Button as ButtonDefault } from "@/components/ui/Button"
import { useSessionUser } from "@/store/authStore"
import type { SignatureRequest, SignatureStatus } from "@/@types"
import demandeServices from "@/services/DemandeService"
import { base64ToFile, fileToBase64 } from '@/utils/fileManagement'
import WebViewerPdfDocument from "@/components/ui/WebViewerPdfDocument"
import WebViewerPdfBiometric, { WebViewerPdfBiometricRef } from '@/components/ui/WebViewerPdfBiometric'
import { string } from 'zod'

type SignatureType = "biometrique" | "electronique"

export default function SignerDemandeView() {
    const [signatureType, setSignatureType] = useState<SignatureType>("electronique")
    const [isLoading, setIsLoading] = useState(true)
    const [isSigning, setIsSigning] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [demande, setDemande] = useState<SignatureRequest | null>(null)
    const [documentFile, setDocumentFile] = useState<File | null>(null)
    const { documentId } = useParams()
    const { user } = useSessionUser()
    const [userSignature, setUserSignature] = useState<string>("")
    const [signedFile, setSignedFile] = useState<File|null>(null)
    const navigate = useNavigate()
    const webViewerPdfBiometricRef = useRef<WebViewerPdfBiometricRef>(null)
    const isSender = demande?.sender?.id === user?.id
    const [isCurrentSigner, setIsCurrentSigner] = useState<boolean>(false)
    const [isCurrentApprobateur, setIsCurrentApprobateur] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!documentId) return
            setIsLoading(true)
            try {
                // Récupérer les informations de la demande
                const demandeResponse = await demandeServices.getDemandeById(documentId)
                if (demandeResponse.data != null) {
                    setDemande(demandeResponse.data)
                    setIsCurrentSigner(demandeResponse.data.currentUserSigner!)
                    setIsCurrentApprobateur(demandeResponse.data.currentUserApprobateur!)
                    // Récupérer le document PDF
                    const documentResponse = await demandeServices.getDocumentByDemandeId(documentId)
                    if (documentResponse.data) {
                        // Créer un objet File à partir du Blob
                        const contenuBase64 = documentResponse.data.contenuBase64!
                        const file = base64ToFile(contenuBase64, documentResponse.data.nom!, "application/pdf")
                            setDocumentFile(file)
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error)
                toast.error("Impossible de charger la demande ou le document")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [documentId])

    useEffect( () => {
        async function getString (){
            const fileBase64 = await fileToBase64(signedFile!);
            console.log(fileBase64)
        }
        getString();

    }, [signedFile])

    const handleSignatureTypeChange = (value: string) => {
        setSignatureType(value as SignatureType)
    }

    const handleSignDocument = async () => {
        if (!documentId) return

        setIsSigning(true)
        try {
            if (webViewerPdfBiometricRef.current){
                await webViewerPdfBiometricRef.current.getPdfFile()
            }
            // Appel à l'API pour signer le document
            // await demandeServices.signerDemande(id)
            // toast.success("Document signé avec succès")
            // navigate("/demandes") // Redirection vers la liste des demandes

        } catch (error) {
            console.error("Erreur lors de la signature:", error)
            toast.error("Impossible de signer le document")
        } finally {
            setIsSigning(false)
        }
    }

    const handleApproveDocument = async () => {
        if (!documentId) return

        setIsApproving(true)
        try {
            // Appel à l'API pour approuver le document
            // await demandeServices.approuverDemande(id)
            toast.success("Document approuvé avec succès")
            navigate("/demandes") // Redirection vers la liste des demandes
        } catch (error) {
            console.error("Erreur lors de l'approbation:", error)
            toast.error("Impossible d'approuver le document")
        } finally {
            setIsApproving(false)
        }
    }

    const onUserSetSignature = () => {
        setUserSignature("")
    }
    const onGetSignedFile = (file: File) => {
        setSignedFile(file)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!demande) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Demande non trouvée</h2>
                <p className="text-muted-foreground mb-4">
                    La demande que vous recherchez n&apos;existe pas ou a été supprimée.
                </p>
                <ButtonDefault
                    onClick={() => navigate("/demandes")}
                    className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white hover:border-none hover:ring-0"
                >
                    Retour aux demandes
                </ButtonDefault>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            {/* En-tête avec les informations de la demande */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <h1 className="text-xl font-bold mb-2">{demande.titre}</h1>
                <p className="text-muted-foreground mb-4">{demande.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                        <span className="font-medium">Statut:</span>{" "}
                        <span
                            className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                demande.status === "SIGNEE"
                                    ? "bg-green-100 text-green-800"
                                    : demande.status === "REFUSEE"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800",
                            )}
                        >
              {formatStatus(demande.status)}
            </span>
                    </div>
                    <div>
                        <span className="font-medium">Date limite:</span> {formatDate(demande.dateLimite)}
                    </div>
                    <div>
                        <span className="font-medium">Créé par:</span> {demande.sender?.prenom} {demande.sender?.nom}
                    </div>
                </div>
            </div>

            {/* Contenu principal avec flexbox */}
            <div className="flex flex-grow">
                {/* Panneau de gauche - Options de signature (affiché conditionnellement) */}
                {(isCurrentSigner || isCurrentApprobateur) && (
                    <div className="w-1/3 pr-4">
                        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    {isCurrentSigner ? (
                                        <>
                                            <Pen className="h-5 w-5" />
                                            <span>Type de signature</span>
                                        </>
                                    ) : (
                                        <>
                                            <ThumbsUp className="h-5 w-5" />
                                            <span>Approbation</span>
                                        </>
                                    )}
                                </h2>
                            </div>

                            <div className="p-4 flex-grow">
                                {isCurrentSigner ? (
                                    <>
                                        <RadioGroup value={signatureType} onValueChange={handleSignatureTypeChange} className="space-y-4">
                                            <div className="flex items-start space-x-3 space-y-0">
                                                <RadioGroupItem value="biometrique" id="biometrique" />
                                                <div className="grid gap-1.5">
                                                    <Label htmlFor="biometrique" className="font-medium">
                                                        Biométrique
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Signature manuscrite capturée sur un appareil tactile
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3 space-y-0">
                                                <RadioGroupItem value="electronique" id="electronique" />
                                                <div className="grid gap-1.5">
                                                    <Label htmlFor="electronique" className="font-medium">
                                                        Électronique
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Signature électronique avec certificat numérique
                                                    </p>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm">
                                            Vous êtes invité à approuver ce document avant qu&apos;il ne soit envoyé aux signataires.
                                        </p>
                                        <p className="text-sm">Veuillez examiner attentivement le document avant de l&apos;approuver.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t">
                                {isCurrentSigner ? (
                                    <ButtonDefault
                                        onClick={handleSignDocument}
                                        disabled={isSigning}
                                        loading={isSigning}
                                        className="bg-blue-500 w-full text-white hover:bg-blue-400 hover:text-white hover:border-none hover:ring-0"
                                    >
                                        Signer le document
                                    </ButtonDefault>
                                ) : (
                                    <ButtonDefault
                                        onClick={handleApproveDocument}
                                        disabled={isApproving}
                                        loading={isApproving}
                                        className="bg-green-500 w-full text-white hover:bg-green-400 hover:text-white hover:border-none hover:ring-0"
                                    >
                                        Approuver le document
                                    </ButtonDefault>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Panneau de droite - Visualiseur PDF */}
                <div
                    className={cn(
                        "bg-white rounded-lg shadow-sm flex flex-col",
                        isCurrentSigner || isCurrentApprobateur ? "w-2/3" : "w-full",
                    )}
                >
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">{demande.titre || "Document"}</h2>
                    </div>
                    <div className="flex-grow">
                        <div className="h-full w-full">
                            {
                                signatureType === "electronique"
                                ?  <WebViewerPdfDocument
                                        file={documentFile}
                                        restrictedMode= "electronique"
                                    />
                                    :  <WebViewerPdfBiometric
                                        ref={webViewerPdfBiometricRef}
                                        file={documentFile}
                                        signature={userSignature}
                                        setSignature={onUserSetSignature}
                                        setSignedFile={onGetSignedFile}
                                    />
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Fonction utilitaire pour formater le statut
function formatStatus(status: SignatureStatus): string {
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

// Fonction utilitaire pour formater la date
function formatDate(date: Date | string): string {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

