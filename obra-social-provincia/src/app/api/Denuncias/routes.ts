// Importa los módulos necesarios
import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../lib/prisma"


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
