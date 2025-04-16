import { useEffect, useRef, useState } from "react"
import WebViewer, { Core } from '@pdftron/webviewer'
import { FileText } from "lucide-react"

interface WebViewerPdfProps {
    file?: File | null
    restrictedMode?: boolean
}

export default function WebViewerPdf({ file, restrictedMode = false }: WebViewerPdfProps) {
    const viewer = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!file || !viewer.current) return

        const loadPDF = async () => {
            setIsLoading(true)

            const reader = new FileReader()
            reader.readAsArrayBuffer(file)

            reader.onload = async function () {
                const arrayBuffer = reader.result as ArrayBuffer

                const blob = new Blob([arrayBuffer], { type: "application/pdf" })

                const instance = await WebViewer(
                    {
                        path: "/webviewer/public",
                        licenseKey: "demo:1742976837142:61288cf803000000000472f1cd0f0705d57cd6722e3aa3dc8ed87eef9c"
                    },
                    viewer.current!
                )

                instance.UI.loadDocument(blob, { filename: file.name })
                instance.UI.setZoomLevel('100%')
                // 🎨 Personnalisation de l'interface
                instance.UI.setTheme("light")
                instance.UI.setLanguage("fr")

                instance.UI.disableElements([
                    "tools-header", // ✅ Disables header toolbar
                    'downloadButton',
                    'notesPanelToggle',
                    'printButton',
                    'default-ribbon-groupDropdown',
                    'groupedLeftHeaderButtonsFlyoutToggle',
                    'moreRibbonsButton',
                    'toolbarGroup-Annotate',
                    'toolbarGroup-View',
                    'toolbarGroup-Shapes',
                    'toolbarGroup-Insert',
                    'toolbarGroup-Edit',
                    'view-controls-toggle-button',
                    'documentCropPopup',
                    'toolbarGroup-Forms',
                    'toolbarGroup-FillAndSign',
                    'indexPanel'
            ]);

            if (restrictedMode) {
                // instance.UI.disableElements(['all']);
            }

                setIsLoading(false)
            }
        }

        loadPDF()
    }, [file, restrictedMode])

    if (!file) {
        return (
            <div className="rounded-2xl w-full h-[617px] overflow-hidden bg-white relative flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Prévisualisation PDF</h3>
                <p className="text-sm text-gray-500">Aucun fichier PDF sélectionné</p>
            </div>
        )
    }

    return (
        <div className="rounded-2xl w-full max-h-[1030px] overflow-hidden bg-white relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            )}
            <div ref={viewer} className="webviewer w-full h-full"></div>
        </div>
    )
}