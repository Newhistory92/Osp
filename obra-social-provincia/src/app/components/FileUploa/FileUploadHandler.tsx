


export const handleFileUpload = (event: any, onFileConverted: (base64: string | null) => void) => {
    const file = event.files[0];
    //console.log("Archivo subido:", file);

    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            //console.log("Archivo convertido a Base64:", base64String);
            onFileConverted(base64String);
        };
        reader.readAsDataURL(file);
    } else {
        console.error("No se pudo obtener el archivo.");
        onFileConverted(null);
    }
};