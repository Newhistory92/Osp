// Importa los módulos necesarios
import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../lib/prisma"
import { currentUser } from '@clerk/nextjs/server';

// Función para manejar las solicitudes GET
export async function GET(req: NextRequest) {
    try {
        // Realiza la consulta a la base de datos para obtener las denuncias
        const denuncias = await prisma.denuncia.findMany({
            // Incluye los datos del autor y del prestador relacionados con cada denuncia
            include: {
                autor: true,
                prestador: true
            }
        });

        // Verifica si se encontraron denuncias
        if (denuncias.length === 0) {
            return NextResponse.json({ status: 400, message: `No se encontraron denuncias` });
        }

        // Devuelve las denuncias encontradas
        return NextResponse.json({ status: 200, message: `Estas son las denuncias:`, denuncias });
    } catch (error: any) {
        console.error("Error al obtener las denuncias:", error);
        return NextResponse.json({ status: 500, message: `Error al obtener las denuncias: ${error.message}` });
    }
}



export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        const body = await req.json();
        const motivo = body.motivo;
        const autorId = user.id; // El ID del usuario autenticado
        const matriculaPrestador = body.matriculaPrestador;


        // Verificar si el prestador existe en la base de datos
        const prestador = await prisma.prestador.findUnique({
            where: {
                matricula: matriculaPrestador
            }
        });
        if (!prestador) {
            return NextResponse.json({ status: 404, message: 'Prestador no encontrado' });
        }

        // Crear la nueva denuncia asociada al afiliado y al prestador
        const nuevaDenuncia = await prisma.denuncia.create({
            data: {
                motivo,
                autorId,
                autor: {
                    connect: { id: autorId }
                },
                prestador: {
                    connect: { id: prestador.id }
                }
            }
        });

        console.log("Denuncia creada correctamente:", nuevaDenuncia);

        return NextResponse.json({ status: 200, message: "Denuncia creada exitosamente", nuevaDenuncia });
    } catch (error) {
        console.error("Error al procesar la solicitud PUT:", error);
        return NextResponse.json({ status: 500, message: "Error interno del servidor" });
    }
}