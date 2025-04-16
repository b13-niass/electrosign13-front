export const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    return new File([blob], fileName, { type: mimeType });
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Converts file to Base64
        reader.onload = () => resolve(reader.result as string); // Returns Base64 string
        reader.onerror = (error) => reject(error);
    });
};

export const forcePdfExtension = (originalFile: File): File => {
    const blob = originalFile.slice(0, originalFile.size, originalFile.type);

    // Ensure it ends with `.pdf`
    const newName = originalFile.name.toLowerCase().endsWith('.pdf')
        ? originalFile.name
        : originalFile.name.replace(/\.\w+$/, '') + '.pdf';

    return new File([blob], newName, {
        type: 'application/pdf',
        lastModified: originalFile.lastModified,
    });
};