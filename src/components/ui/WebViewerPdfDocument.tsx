import { useEffect, useRef, useState } from "react"
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer'
import { FileText } from "lucide-react"
import { useSessionUser } from '@/store/authStore'

interface WebViewerPdfProps {
    file?: File | null
    restrictedMode?: string
}

export default function WebViewerPdfDocument({ file, restrictedMode = 'electronique' }: WebViewerPdfProps) {
    const viewers = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useSessionUser();

    useEffect(() => {
        if (!file || !viewers.current) return

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
                    viewers.current!
                )

                instance.UI.loadDocument(blob, { filename: file.name })
                const { RubberStampCreateTool } = instance.Core.Tools;
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
                    'indexPanel',
                    'panToolButton'
                ]);
                setIsLoading(false)

                function createSignatureButton(webviewer: HTMLElement, instance2: WebViewerInstance) {
                    const signatureButton = document.createElement('button');
                    signatureButton.className = 'Button active ToolButton Button modular-ui icon-only';
                    signatureButton.setAttribute('data-element', 'signatureToolButton');
                    signatureButton.setAttribute('aria-label', 'Créer une signature');
                    signatureButton.type = 'button';

                    // Create the icon div
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'Icon';
                    iconDiv.setAttribute('aria-hidden', 'false');

                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    svg.setAttribute('viewBox', '0 0 24 24');

                    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
                    style.textContent = '.cls-1{fill:#abb0c4;}';
                    defs.appendChild(style);
                    svg.appendChild(defs);

                    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
                    title.textContent = 'icon - tool - stamp - line';
                    svg.appendChild(title);

                    const paths = [
                        { d: "M4,20.5H20V22H4Z" },
                        { d: "M19.27,15H4.74a.76.76,0,0,0-.75.75V19H20V16.26A.76.76,0,0,0,19.27,15Z" },
                        { d: "M15.68,10.79a5,5,0,0,0,1.57-3.54,5.26,5.26,0,0,0-10.51,0,5.06,5.06,0,0,0,1.58,3.56,12.78,12.78,0,0,1,.82,1,7,7,0,0,1,.44,1.44H9v1.5h6v-1.5h-.58a6.08,6.08,0,0,1,.45-1.44A12.73,12.73,0,0,1,15.68,10.79ZM14.28,9.64c-.27.32-.59.7-.9,1.13A6.91,6.91,0,0,0,12.63,13H11.37a6.52,6.52,0,0,0-.76-2.18c-.31-.45-.65-.83-.91-1.15A3.25,3.25,0,0,1,8.56,7.25a3.44,3.44,0,1,1,6.88,0A3.35,3.35,0,0,1,14.28,9.64Z" }
                    ];

                    paths.forEach(pathData => {
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', pathData.d);
                        path.setAttribute('class', 'cls-1');
                        svg.appendChild(path);
                    });

                    iconDiv.appendChild(svg);
                    signatureButton.appendChild(iconDiv);

                    signatureButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        // event.stopPropagation();
                        const docViewer = instance2.Core.documentViewer;
                        const annotManager = docViewer.getAnnotationManager();
                        const { Annotations } = instance2.Core;

                        const pageNumber = 1;
                        const x = 100;
                        const y = 100; // Position Y sur la page

                        // Créer un nouveau tampon RubberStamp
                        const stampAnnot = new Annotations.StampAnnotation();
                        stampAnnot.PageNumber = 1;

                        // Définir la position et la taille
                        stampAnnot.X = x;
                        stampAnnot.Y = y;
                        stampAnnot.Width = 350;
                        stampAnnot.Height = 60;

                        // Définir le contenu du tampon
                        const dateStr = new Date().toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });

                        stampAnnot.Subject = "SignatureP";
                        stampAnnot.setStampText(`[Par ${user.prenom} ${user.nom} le] ${dateStr}`);
                        annotManager.addAnnotation(stampAnnot);

                        annotManager.redrawAnnotation(stampAnnot);
                    });
                    return signatureButton;
                }

                instance.Core.documentViewer.addEventListener('documentLoaded', () => {
                    const webviewer = (document.getElementById("root")!).querySelector(".webviewer")
                    const shadowRoot = webviewer?.children[0].shadowRoot
                    const headerGroupItem = shadowRoot?.querySelector(".GroupedItems")

                    if (headerGroupItem) {
                        const existingSignatureButton = headerGroupItem.querySelector('[data-element="signatureToolButton"]');
                        if (!existingSignatureButton) {
                            const signatureButton = createSignatureButton(webviewer as HTMLElement, instance);
                            headerGroupItem.appendChild(signatureButton);
                            console.log('Signature button added to header group');
                        } else {
                            console.log('Signature button already exists');
                        }
                    } else {
                        console.warn('Could not find header group item');
                    }
                })

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
        <div className="rounded-2xl w-full h-[calc(100vh-300px)] overflow-hidden bg-white relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            )}
            <div ref={viewers} className="webviewer w-full h-full"></div>
        </div>
    )
}