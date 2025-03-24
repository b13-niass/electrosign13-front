import type React from "react"
import { useRef } from "react"
import { Button } from "@/components/shadcn-ui/button"

interface AttachMultipleFileProps {
    onChange: (files: File[]) => void
    accept?: string
    multiple?: boolean
    value?: File[]
}

export function AttachMultipleFile({
                                    onChange,
                                    accept = ".pdf,application/pdf",
                                    multiple = true,
                                    value = [],
                                }: AttachMultipleFileProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        const filesArray = Array.from(e.target.files)
        onChange(filesArray)

        // Réinitialiser l'input pour permettre la sélection du même fichier
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="relative w-full">
            <div className="flex w-full rounded-md border border-input bg-background">
                <div className="flex-1 truncate px-3 py-2 text-sm">
                    {value.length > 0 ? `${value.length} fichier(s) sélectionné(s)` : "Aucun fichier sélectionné"}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-l-none border-l"
                    onClick={() => fileInputRef.current?.click()}
                >
                    choisir...
                </Button>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}

