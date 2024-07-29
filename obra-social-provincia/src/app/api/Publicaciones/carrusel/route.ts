import { NextRequest, NextResponse } from 'next/server';

import prisma from "../../../lib/prisma"

export async function POST(request: NextRequest) {
    try {
        console.log("Recibida solicitud POST para crear un nuevo item de carrusel");
        const nuevaCarrusel = await request.json();
        
        console.log("Datos del nuevo item de carrusel:", nuevaCarrusel);
        
        const carruselCreado = await prisma.$executeRaw`(
            INSERT INTO Carrusel (tituloprincipal, titulosecundario, contenido, urlImagen) 
            VALUES (${nuevaCarrusel.tituloprincipal}, ${nuevaCarrusel.titulosecundario}, ${nuevaCarrusel.contenido}, ${nuevaCarrusel.urlImagen})`;

        console.log("Item de carrusel creado exitosamente:", carruselCreado);
        
        return NextResponse.json({ status: 200, message: "Item de carrusel creado exitosamente", carrusel: carruselCreado });
    } catch (error: any) {
        console.error("Error al crear el item de carrusel:", error);
        return NextResponse.json({ status: 500, message: `Error al crear el item de carrusel: ${error.message}` });
    }
}



export async function DELETE(request: NextRequest) {
    const datosEliminacion = await request.json();
    const id = datosEliminacion.id;
    
    try {
        console.log(`Recibida solicitud DELETE para eliminar el item de carrusel con id: ${id}`);
        
        const carruselEliminado = await prisma.$executeRaw`(
            DELETE FROM Carrusel WHERE id = ${id}
            RETURNING *)`;

        console.log("Item de carrusel eliminado exitosamente:", carruselEliminado);

        return NextResponse.json({ status: 200, message: "Item de carrusel eliminado exitosamente", carrusel: carruselEliminado });
    } catch (error: any) {
        console.error("Error al eliminar el item de carrusel:", error);
        return NextResponse.json({ status: 500, message: `Error al eliminar el item de carrusel: ${error.message}` });
    }
}
