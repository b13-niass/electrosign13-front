import React, { forwardRef, useEffect, useImperativeHandle } from 'react'

import { useState, useRef } from "react"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/shadcn-ui/button"
import { Card, CardContent, CardFooter } from "@/components/shadcn-ui/card"
import { Progress } from "@/components/shadcn-ui/progress"
import { toast } from "sonner"

type UploadStatus = "idle" | "uploading" | "success" | "error"
type UploadFileProps = (file: File) => void

type PdfUploadProps = {
    onUploadFile: (file: File) => void
}

export type PdfUploadRef = {
    clearFile: () => void;
};
const PdfUpload = forwardRef<PdfUploadRef, PdfUploadProps>(function PdfUpload({ onUploadFile }, ref) {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<UploadStatus>("idle")
    const [progress, setProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]

        if (!selectedFile) return

        if (selectedFile.type !== "application/pdf") {
            toast("Format invalide", {
                description: "Veuillez sélectionner un fichier PDF",
            })
            return
        }

        setFile(selectedFile)
        setStatus("idle")
        setProgress(0)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const droppedFile = e.dataTransfer.files?.[0]

        if (!droppedFile) return

        if (droppedFile.type !== "application/pdf") {
            toast("Format invalide", {
                description: "Veuillez déposer un fichier PDF",
            })
            return
        }

        setFile(droppedFile)
        setStatus("idle")
        setProgress(0)
    }

    const handleUpload = async () => {
        if (!file) return

        setStatus("uploading")
        // Simuler la progression du téléchargement
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 5
            })
        }, 100)

        try {
            // Simuler un appel API
            await new Promise((resolve) => setTimeout(resolve, 2000))

            clearInterval(interval)
            setProgress(100)
            setStatus("success")
            onUploadFile(file)
            toast("Téléchargement réussi", {
                description: `${file.name} a été téléchargé avec succès.`,
            })
        } catch (error) {
            clearInterval(interval)
            setStatus("error")

            toast("Échec du téléchargement", {
                description: "Une erreur s'est produite lors du téléchargement de votre fichier. Veuillez réessayer.",
            })
        }
    }

    useImperativeHandle(ref, () => ({
        clearFile: handleClear,
    }));
    const handleClear = () => {
        console.log("ICI clear")
        setFile(null)
        setStatus("idle")
        setProgress(0)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <Card className="w-full border-0 !h-[168px] px-0 py-0 shadow-none">
            <CardContent className="px-0">
                <input
                    type="file"
                    id="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                />

                {!file ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-10 w-10 text-gray-400" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Cliquer pour parcourir ou glisser-déposer</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Seuls les fichiers PDF sont acceptés</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                            <File className="h-8 w-8 text-primary" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleClear} disabled={status === "uploading"}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {status === "uploading" && (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400">Téléchargement... {progress}%</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                                <CheckCircle className="h-4 w-4" />
                                <span>Téléchargement terminé</span>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <span>Échec du téléchargement. Veuillez réessayer.</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {file && status !== "uploading" && (
                    <>
                        <Button variant="outline" onClick={handleClear}>
                            Annuler
                        </Button>
                        {status !== "success" && <Button onClick={handleUpload}>Téléverser</Button>}
                    </>
                )}
            </CardFooter>
        </Card>
    )
})

export default PdfUpload