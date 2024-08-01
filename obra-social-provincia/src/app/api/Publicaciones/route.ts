
import prisma from "../../lib/prisma"


import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url= new URL(req.url);
        const searchParams= new URLSearchParams (url.searchParams)
        const published = searchParams.get('published');

        let publicaciones;

        if (published) {
            publicaciones = await prisma.$queryRaw`
            SELECT p.*, o.name as autor_name 
            FROM Publicacion p 
            JOIN Operador o ON p.autorId = o.id 
            WHERE p.published = ${published}
        `;
    } else {
        publicaciones = await prisma.$queryRaw`
            SELECT p.*, o.name as autor_name 
            FROM Publicacion p 
            JOIN Operador o ON p.autorId = o.id
        `;
        }

        // Verifica si se encontraron publicaciones
        // if (publicaciones.length === 0) {
        //     return NextResponse.json({ status: 400, message: `No se encontraron publicaciones` });
        // }

        // Devuelve las publicaciones encontradas
        return NextResponse.json({ status: 200, message: `Estas son las publicaciones:`, publicaciones });
    } catch (error:any) {
        console.error("Error al obtener las publicaciones:", error);
        return NextResponse.json({ status: 500, message: `Error al obtener las publicaciones: ${error.message}` });
    }
}



export async function POST(request: NextRequest) {
    try {
        //console.log("Recibida solicitud POST para crear una nueva publicación");
        const nuevaPublicacion = await request.json();
        const currentDateTime = new Date().toISOString()
        const result = await prisma.$executeRaw`
            INSERT INTO Publicacion (titulo, published, contenido,imagen, autorId,updatedAt) 
            VALUES (${nuevaPublicacion.titulo}, ${nuevaPublicacion.published}, ${nuevaPublicacion.contenido},${nuevaPublicacion.imagen || null}, ${nuevaPublicacion.autorId},${currentDateTime})`;

        const publicacionCreada = result;
        //console.log("Publicación creada exitosamente:", publicacionCreada);
        
        return NextResponse.json({ status: 200, message: "Publicación creada exitosamente", publicacion: publicacionCreada });
    } catch (error:any) {
        console.error("Error al crear la publicación:", error);
        return NextResponse.json({ status: 500, message: `Error al crear la publicación: ${error.message}` });
    }
}


export async function PUT(request: NextRequest) {
    try {
       // console.log("Recibida solicitud PUT para actualizar una publicación");
        const datosActualizados = await request.json();
        const id = datosActualizados.id;
        

        const result = await prisma.$executeRaw`
            UPDATE Publicacion 
            SET titulo = ${datosActualizados.titulo}, 
                published = ${datosActualizados.published}, 
                contenido = ${datosActualizados.contenido}, 
                imagen = ${datosActualizados.imagen}, 
                autorId = ${datosActualizados.autorId} 
            WHERE id = ${id}
            RETURNING *
        `;

        const publicacionActualizada = result;
        //console.log("Publicación actualizada exitosamente:", publicacionActualizada);

        return NextResponse.json({ status: 200, message: "Publicación se actualizó exitosamente", publicacionActualizada });
    } catch (error:any) {
        console.error("Error al actualizar la publicación:", error);
        return NextResponse.json({ status: 500, message: `Error al actualizar la publicación: ${error.message}` });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        //console.log("Recibida solicitud DELETE para eliminar una publicación");
        const datosEliminacion = await request.json();
        const id = datosEliminacion.id;

        const result = await prisma.$executeRaw`
            DELETE FROM Publicacion WHERE id = ${id}
            RETURNING *
        `;

        const publicacionEliminada = result;
        //console.log("Publicación eliminada exitosamente:", publicacionEliminada);
        
        return NextResponse.json({ status: 200, message: "Publicación eliminada exitosamente", publicacionEliminada });
    } catch (error:any) {
        console.error("Error al eliminar la publicación:", error);
        return NextResponse.json({ status: 500, message: `Error al eliminar la publicación: ${error.message}` });
    }
}
