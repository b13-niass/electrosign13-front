import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import WebViewer, { Core, WebViewerInstance } from '@pdftron/webviewer'
import { FileText } from "lucide-react"
import { fileToBase64, forcePdfExtension } from '@/utils/fileManagement'
import { callback } from 'chart.js/helpers'
import Annotations = Core.Annotations
import { exists } from 'node:fs'
import { useSessionUser } from '@/store/authStore'
import DocumentViewer = Core.DocumentViewer

interface WebViewerPdfProps {
    file?: File | null
    // signature?: string
    setSignature?: (signature: string) => void
    setSignedFile?: (file: File) => void
}
export interface WebViewerPdfBiometricRef{
    getPdfFile: () => Promise<void>
}

const WebViewerPdfBiometric = forwardRef<WebViewerPdfBiometricRef, WebViewerPdfProps>( function WebViewerPdfBiometric({ file, setSignature, setSignedFile}, ref) {
    const viewersbio = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [instance, setInstance] = useState<WebViewerInstance>()
    const { user, setUser } = useSessionUser()
    const [isInitWebViewer, setIsInitWebViewer] = useState(false)
    useEffect(() => {
        if (!file || !viewersbio.current) return

        const loadPDF = async () => {
            setIsLoading(true)
            setIsInitWebViewer(true)
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)

            reader.onload = async function () {
                const arrayBuffer = reader.result as ArrayBuffer

                const blob = new Blob([arrayBuffer], { type: "application/pdf" })

                const instancebio = await WebViewer(
                    {
                        path: "/webviewer/public",
                        licenseKey: "demo:1742976837142:61288cf803000000000472f1cd0f0705d57cd6722e3aa3dc8ed87eef9c",
                        fullAPI: true
                    },
                    viewersbio.current!,
                )
                instancebio.UI.loadDocument(blob, { filename: file.name })
                const { documentViewer, PDFNet, annotationManager, Tools } = instancebio.Core;

                // 🎨 Personnalisation de l'interface
                instancebio.UI.setTheme("light")
                await instancebio.UI.setLanguage("fr")
                instancebio.UI.enableFeatures([instancebio.UI.Feature.Initials]);
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

                function createSignatureButton(webviewer: HTMLElement) {
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
                        // event.stopPropagation();
                        const child1 = webviewer.children[0] as HTMLElement
                        console.log("OUI")
                        instancebio.UI.openElements(['signatureModal']);
                        child1.remove()
                        // child2.style.position = 'absolute';
                        // child2.style.top = '0';
                    });

                    return signatureButton;
                }

                function createSignatureButton2(webviewer: HTMLElement) {
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
                        // event.stopPropagation();
                        console.log("OUI")
                        instancebio.UI.openElements(['signatureModal']);
                    });

                    return signatureButton;
                }

                instancebio.Core.documentViewer.addEventListener('documentLoaded', () => {
                    console.log("encore")
                    const signatureTool = documentViewer.getTool(Tools.ToolNames.SIGNATURE) as Core.Tools.SignatureCreateTool;
                    console.log(user.mySignature)
                    if (user.mySignature) {
                        signatureTool.importSignatures([user.mySignature]);
                    }
                    documentViewer.setToolMode(signatureTool);

                    const webviewer = (document.getElementById("root")!).querySelector(".webviewer")
                    const shadowRoot = webviewer?.children[0].shadowRoot
                    const shadowRoot1 = webviewer?.children[1].shadowRoot
                    const headerGroupItem = shadowRoot?.querySelector(".GroupedItems")
                    const headerGroupItem1 = shadowRoot1?.querySelector(".GroupedItems")
                    setInstance(instancebio)

                    if (headerGroupItem && headerGroupItem1) {
                        const existingSignatureButton = headerGroupItem.querySelector('[data-element="signatureToolButton"]');
                        const existingSignatureButton1 = headerGroupItem1.querySelector('[data-element="signatureToolButton"]');

                        if (!existingSignatureButton && !existingSignatureButton1) {
                            const signatureButton = createSignatureButton(webviewer as HTMLElement);
                            const signatureButton1 = createSignatureButton2(webviewer as HTMLElement);
                            headerGroupItem.appendChild(signatureButton);
                            headerGroupItem1.appendChild(signatureButton1);
                            console.log('Signature button added to header group');
                        } else {
                            console.log('Signature button already exists');
                        }
                    } else {
                        console.warn('Could not find header group item');
                    }
                })

                async function extractAnnotationSignature(annotation: Annotations.Annotation, docViewer: DocumentViewer) {
                    const canvas = document.createElement('canvas');
                    const pageMatrix = docViewer.getDocument().getPageMatrix(annotation.PageNumber);
                    canvas.height = annotation.Height;
                    canvas.width = annotation.Width;
                    const ctx = canvas.getContext('2d');
                    ctx!.translate(-annotation.X, -annotation.Y);
                    annotation.draw(ctx!, pageMatrix);
                    canvas.toBlob(async (blob) => {
                        const file = new File([blob!], 'signature.png', { type: 'image/png' });
                        if (setSignature) {
                            const fileBase64 = await fileToBase64(file);
                            console.log(fileBase64)
                            setSignature(fileBase64)
                            user.mySignature = fileBase64;
                            setUser(user)
                        }
                    });
                }

                instancebio.Core.documentViewer.addEventListener('annotationsLoaded', () => {
                    instancebio.Core.annotationManager.addEventListener('annotationChanged', async (annotationList) => {
                        for (const annotation of annotationList) {
                            if (annotation.Subject === "Signature") {
                                const annotationManager = documentViewer.getAnnotationManager();
                                const document = documentViewer.getDocument();
                                const xfdfString = await annotationManager.exportAnnotations()
                                const data = await document.getFileData({
                                    xfdfString,
                                    flatten: true,
                                    includeAnnotations: true,
                                });
                                const modifiedFile = new File([data], document.getFilename() || 'signed-document.pdf', {
                                    type: 'application/pdf'
                                });
                                if (setSignedFile) {
                                    console.log(modifiedFile)
                                    setSignedFile(forcePdfExtension(modifiedFile))
                                }
                                if (user.mySignature == ""){
                                    await extractAnnotationSignature(annotation, documentViewer)
                                }
                            }
                        }
                    })
                });

            }
        }

        if (!isInitWebViewer){
            loadPDF()
        }
    }, [file])


    // async function getModifiedPdfFile() {
    //     try {
    //         const documentViewer = instance!.Core.documentViewer;
    //         const annotationManager = documentViewer.getAnnotationManager();
    //         const document = documentViewer.getDocument();
    //
    //         if (!document) {
    //             console.warn('No document loaded');
    //             return;
    //         }
    //
    //         const xfdfString = await annotationManager.exportAnnotations()
    //         console.log(xfdfString);
    //         // Get file data
    //         const data = await document.getFileData({
    //             xfdfString,
    //             flatten: true,
    //             includeAnnotations: true,
    //         });
    //
    //         // Create File object
    //         const modifiedFile = new File([data], document.getFilename() || 'signed-document.pdf', {
    //             type: 'application/pdf'
    //         });
    //
    //         if (modifiedFile){
    //             setSignedFile!(modifiedFile)
    //         }
    //     } catch (error) {
    //         console.error('Error getting PDF file:', error);
    //     }
    // }
    // useImperativeHandle(ref, () => ({
    //     getPdfFile:  () =>  getModifiedPdfFile(),
    // }));

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