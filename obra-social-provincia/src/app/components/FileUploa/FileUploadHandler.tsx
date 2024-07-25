import React, { useState } from 'react';
import { FileUploadHandlerEvent } from 'primereact/fileupload';

interface FileUploadHandlerProps {
    archivoBase64: string | null;
}

export const FileUploadHandler = (p0: { archivoBase64: string | null; }) => {
    const [archivoBase64, setArchivoBase64] = useState<string | null>(null);

    const handleFileUpload = (event: FileUploadHandlerEvent) => {
        const file = event.files[0];
        console.log("Archivo subido:", file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                console.log("Archivo convertido a Base64:", base64String);
               setArchivoBase64(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            console.error("No se pudo obtener el archivo.");
            setArchivoBase64(null);
        }
    };

    return { handleFileUpload };
};
