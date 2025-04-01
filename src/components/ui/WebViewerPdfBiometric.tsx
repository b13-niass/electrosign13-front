import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import WebViewer, { Core, WebViewerInstance } from '@pdftron/webviewer'
import { FileText } from "lucide-react"
import { fileToBase64 } from '@/utils/fileManagement'
import { callback } from 'chart.js/helpers'

interface WebViewerPdfProps {
    file?: File | null
    signature?: string
    setSignature?: () => void
    setSignedFile?: (file: File) => void
}
export interface WebViewerPdfBiometricRef{
    getPdfFile: () => Promise<void>
}

const WebViewerPdfBiometric = forwardRef<WebViewerPdfBiometricRef, WebViewerPdfProps>( function WebViewerPdfBiometric({ file, signature, setSignature, setSignedFile}, ref) {
    const viewersbio = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [instance, setInstance] = useState<WebViewerInstance>()
    useEffect(() => {
        if (!file || !viewersbio.current) return

        const loadPDF = async () => {
            setIsLoading(true)

            const reader = new FileReader()
            reader.readAsArrayBuffer(file)

            reader.onload = async function () {
                const arrayBuffer = reader.result as ArrayBuffer

                const blob = new Blob([arrayBuffer], { type: "application/pdf" })

                const instancebio = await WebViewer(
                    {
                        path: "/webviewer/public",
                        licenseKey: "demo:1742976837142:61288cf803000000000472f1cd0f0705d57cd6722e3aa3dc8ed87eef9c",
                        fullAPI: true,
                    },
                    viewersbio.current!,
                )
                instancebio.UI.loadDocument(blob, { filename: file.name })
                const { documentViewer, PDFNet, annotationManager } = instancebio.Core;

                // 🎨 Personnalisation de l'interface
                instancebio.UI.setTheme("light")
                instancebio.UI.setLanguage("fr")
                instancebio.UI.disableElements([
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
                    'indexPanel',
                    'panToolButton'
                ]);

                setIsLoading(false)

                function createSignatureButton() {
                    // Create the main button element
                    const signatureButton = document.createElement('button');
                    signatureButton.className = 'Button active ToolButton Button modular-ui icon-only';
                    signatureButton.setAttribute('data-element', 'signatureToolButton');
                    signatureButton.setAttribute('aria-label', 'Créer une signature');
                    signatureButton.type = 'button';

                    // Create the icon div
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'Icon';
                    iconDiv.setAttribute('aria-hidden', 'false');

                    // Create SVG for signature icon
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('viewBox', '0 0 24 24');
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                    // Create defs and style
                    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
                    style.textContent = '.cls-1{fill:#868E96;}';
                    defs.appendChild(style);
                    svg.appendChild(defs);

                    // Create paths from the original SVG
                    const paths = [
                        {
                            d: "M20,12.66a1,1,0,0,0-1.27.7c-.21.77-1,3-2.39,3.45.08-.42.22-1,.32-1.33.41-1.58.71-2.71-.23-3.25a2,2,0,0,0-2.79.42,4.84,4.84,0,0,0-.55.93,7.14,7.14,0,0,1-2.18,2.81,3.12,3.12,0,0,1-1.12.33,2.47,2.47,0,0,1-1-.5,1.46,1.46,0,0,1-.21-.28c5.29-5.08,5.58-9.51,5.52-10.84a3.59,3.59,0,0,0-1.21-2.91A1,1,0,0,0,12.05,2c-2.86.59-4.63,4-5.57,10.83l-.05.25a7.89,7.89,0,0,0-.17,2.19L5.43,16A4.18,4.18,0,0,1,4.12,17a1.25,1.25,0,0,1,.19-.69A1,1,0,0,0,4,14.86a1.06,1.06,0,0,0-1.44.27,2.7,2.7,0,0,0,.18,3.48A1.8,1.8,0,0,0,3.94,19a4.45,4.45,0,0,0,2.88-1.54l.2-.17a2.09,2.09,0,0,0,.24.28A4.23,4.23,0,0,0,9.6,18.72,4.81,4.81,0,0,0,12.13,18a8.11,8.11,0,0,0,2.47-2.94c-.42,1.57-.64,2.58-.14,3.27a1.29,1.29,0,0,0,.94.54c2.37.27,4.35-1.6,5.29-5A1,1,0,0,0,20,12.66ZM11.87,4.23A4.1,4.1,0,0,1,12,5.42c0,1-.31,3.91-3.47,7.57C9,9.48,10,5.33,11.87,4.23Zm10.07,6.28a1.46,1.46,0,0,1-2.9,0,1.45,1.45,0,0,1,2.9,0Z"
                        },
                        {
                            d: "M3.45,19.99h16.66V22H3.45Z"
                        }
                    ];

                    paths.forEach(pathData => {
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', pathData.d);
                        path.setAttribute('class', 'cls-1');
                        svg.appendChild(path);
                    });

                    iconDiv.appendChild(svg);
                    signatureButton.appendChild(iconDiv);

                    // Add click event to open signature modal
                    signatureButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        instancebio.UI.openElements(['signatureModal']);
                    });

                    return signatureButton;
                }

                instancebio.Core.documentViewer.addEventListener('documentLoaded', () => {
                    const webviewer = (document.getElementById("root")!).querySelector(".webviewer")
                    const shadowRoot = webviewer?.children[0].shadowRoot
                    const headerGroupItem = shadowRoot?.querySelector(".GroupedItems")
                    // const filePdf =
                    setInstance(instancebio)

                    if (headerGroupItem) {
                        const existingSignatureButton = headerGroupItem.querySelector('[data-element="signatureToolButton"]');

                        if (!existingSignatureButton) {
                            const signatureButton = createSignatureButton();
                            headerGroupItem.appendChild(signatureButton);
                            console.log('Signature button added to header group');
                        } else {
                            console.log('Signature button already exists');
                        }
                    } else {
                        console.warn('Could not find header group item');
                    }
                })
                instancebio.Core.documentViewer.addEventListener('annotationsLoaded', async () => {
                    instancebio.Core.annotationManager.addEventListener('annotationChanged', async (annotationList) => {
                        for (const annotation of annotationList) {
                            if (annotation.Subject === "Signature"){
                               try {
                                   await PDFNet.initialize();
                                   const doc = await documentViewer.getDocument().getPDFDoc();

                                   // export annotations from the document
                                   const annots = await annotationManager.exportAnnotations();

                                   // Run PDFNet methods with memory management
                                   await PDFNet.runWithCleanup(async () => {

                                       // lock the document before a write operation
                                       // runWithCleanup will auto unlock when complete
                                       await doc.lock();

                                       // import annotations to PDFNet
                                       const fdf_doc = await PDFNet.FDFDoc.createFromXFDF(annots);
                                       await doc.fdfUpdate(fdf_doc);

                                       // flatten all annotations in the document
                                       await doc.flattenAnnotations();

                                       // or optionally only flatten forms
                                       // await doc.flattenAnnotations(true);

                                       // clear the original annotations
                                       annotationManager.deleteAnnotations(annotationManager.getAnnotationsList());

                                       // optionally only clear widget annotations if forms were only flattened
                                       // const widgetAnnots = annots.filter(a => a instanceof Annotations.WidgetAnnotation);
                                       // annotationManager.deleteAnnotations(widgetAnnots);
                                   }, "demo:1742976837142:61288cf803000000000472f1cd0f0705d57cd6722e3aa3dc8ed87eef9c");

                                   // clear the cache (rendered) data with the newly updated document
                                   documentViewer.refreshAll();

                                   // Update viewer to render with the new document
                                   documentViewer.updateView();

                                   // Refresh searchable and selectable text data with the new document
                                   documentViewer.getDocument().refreshTextData();
                               }catch (error) {
                                   console.log(error)
                               }
                            }
                        }
                    })
                });

            }
        }

        loadPDF()

    }, [file])

    async function getModifiedPdfFile() {
        try {
            const documentViewer = instance!.Core.documentViewer;
            const annotationManager = documentViewer.getAnnotationManager();
            const document = documentViewer.getDocument();

            if (!document) {
                console.warn('No document loaded');
                return;
            }

            const xfdfString = await annotationManager.exportAnnotations()

            // Get file data
            const data = await document.getFileData({
                xfdfString,
                flatten: true,
                includeAnnotations: true,
            });

            // Create File object
            const modifiedFile = new File([data], document.getFilename() || 'signed-document.pdf', {
                type: 'application/pdf'
            });

            if (modifiedFile){
                setSignedFile!(modifiedFile)
            }
        } catch (error) {
            console.error('Error getting PDF file:', error);
        }
    }
    useImperativeHandle(ref, () => ({
        getPdfFile:  () =>  getModifiedPdfFile(),
    }));

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
        <div className="rounded-2xl w-full h-[calc(100vh-300px)] overflow-hidden bg-white relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            )}
            <div ref={viewersbio} className="webviewer w-full h-full"></div>
        </div>
    )
})

export default WebViewerPdfBiometric