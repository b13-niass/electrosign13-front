"use client"

import { useState, useEffect } from "react"
import { FileText, Upload } from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
    file?: File | null
}

export default function PDFViewer({ file }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        if (file) {
            const fileUrl = URL.createObjectURL(file)
            setUrl(fileUrl)
            return () => URL.revokeObjectURL(fileUrl)
        } else {
            setUrl(null)
        }
    }, [file])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
        setPageNumber(1)
    }

    return (
        <div className="border border-gray-300 rounded-lg w-[452px] h-[617px] overflow-hidden bg-white relative">
            {!url ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Prévisualisation PDF</h3>
                    <p className="text-sm text-gray-500 mb-4">Uploadez un fichier PDF pour le prévisualiser ici</p>
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col items-center justify-center w-full max-w-xs p-4 border-2 border-dashed border-gray-300 rounded-lg">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Glissez-déposez ou sélectionnez un fichier</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <Document file={url} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center">
                            <Page pageNumber={pageNumber} width={440} renderTextLayer={false} />
                        </Document>
                    </div>
                    {numPages && numPages > 1 && (
                        <div className="p-2 bg-gray-50 border-t flex items-center justify-between">
                            <button
                                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                                disabled={pageNumber <= 1}
                                className="px-2 py-1 text-sm bg-white border rounded disabled:opacity-50"
                            >
                                Précédent
                            </button>
                            <span className="text-sm">
                Page {pageNumber} sur {numPages}
              </span>
                            <button
                                onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                                disabled={pageNumber >= numPages}
                                className="px-2 py-1 text-sm bg-white border rounded disabled:opacity-50"
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

