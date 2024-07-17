
import prisma from "../../lib/prisma"


import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url= new URL(req.url);
        const searchParams= new URLSearchParams (url.searchParams)
        const published = searchParams.get('published');

        let publicaciones;

        if (published) {
            publicaciones = await prisma.publicacion.findMany({
                where: {
                    published: published
                },
                include: {
                    autor: {
                        select: {
                            name: true,
                           
                        }
                    }
                }
            });
        } else {
            publicaciones = await prisma.publicacion.findMany({
                include: {
                    autor: {
                        select: {
                            name: true,
                            
                        }
                    }
                }
            });
        }

        // Verifica si se encontraron publicaciones
        if (publicaciones.length === 0) {
            return NextResponse.json({ status: 400, message: `No se encontraron publicaciones` });
        }

        // Devuelve las publicaciones encontradas
        return NextResponse.json({ status: 200, message: `Estas son las publicaciones:`, publicaciones });
    } catch (error:any) {
        console.error("Error al obtener las publicaciones:", error);
        return NextResponse.json({ status: 500, message: `Error al obtener las publicaciones: ${error.message}` });
    }
}



// Función para manejar la solicitud POST
export async function POST(request: NextRequest) {
    try {
        console.log("Recibida solicitud POST para crear una nueva publicación");
        const nuevaPublicacion = await request.json();
      
        console.log("Datos de la nueva publicación:", nuevaPublicacion);
        const publicacionCreada = await prisma.publicacion.create({ // Crea la nueva publicación en la base de datos utilizando Prisma
            data: nuevaPublicacion,
        });
        console.log("Publicación creada exitosamente:", publicacionCreada);
        
        return NextResponse.json({ status: 200, message: "Publicación creada exitosamente", publicacion: publicacionCreada });
    } catch (error:any) {
        console.error("Error al verificar la autenticación del usuario:", error);
        return NextResponse.json({ status: 500, message: `Error al crear la publicación: ${error.message}` });
    }
}

// Función para manejar la solicitud PUT
export async function PUT(request: NextRequest) {
    try {
        console.log("Recibida solicitud PUT para actualizar una publicación");
        const datosActualizados = await request.json()
        const id = datosActualizados.id;
        console.log(datosActualizados);
        console.log(id)
        const publicacionActualizada = await prisma.publicacion.update({ // Actualiza la publicación en la base de datos utilizando Prisma
            where: { id:id },
            data: datosActualizados,
        });
        console.log("Publicación actualizada exitosamente:", publicacionActualizada);
        return NextResponse.json({ status: 200, message: "Publicación se actualizo exitosamente", publicacionActualizada });
    }catch (error:any) {
        console.error("Error al crear la publicacion:", error);
        return NextResponse.json({ status: 500, message: `Error al actualizar  la publicación: ${error.message}` });
    }
}



export async function DELETE(request: NextRequest) {
    try {
        console.log("Recibida solicitud DELETE para eliminar una publicación");
        const datosEliminacion = await request.json();
        const id = datosEliminacion.id;

        // Elimina la publicación de la base de datos utilizando Prisma
        const publicacionEliminada = await prisma.publicacion.delete({
            where: { id: Number(id) }
        });

        console.log("Publicación eliminada exitosamente:", publicacionEliminada);
        return NextResponse.json({ status: 200, message: "Publicación eliminada exitosamente" });
    } catch (error:any) {
        console.error("Error al eliminar la publicación:", error);
        return NextResponse.json({ status: 500, message: `Error al eliminar la publicación: ${error.message}` });
    }
}