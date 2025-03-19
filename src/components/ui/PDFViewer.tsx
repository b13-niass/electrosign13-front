"use client"

import { useState, useEffect } from "react"
import { FileText, Upload } from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `/home/noone/Desktop/sonatel_academy/projet_final/electrosign13-front/node_modules/pdfjs-dist/build/pdf.worker.min.mjs`

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
        <div className="rounded-2xl w-full h-[617px] overflow-hidden bg-white relative">
            {!url ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Prévisualisation PDF</h3>
                </div>
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <Document file={url} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center">
                            <Page pageNumber={pageNumber} width={444} renderTextLayer={false} />
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

