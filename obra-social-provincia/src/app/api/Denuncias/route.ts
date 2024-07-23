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
        const body = await req.json();
        const { denuncia, NombreEfector, EspecialidadEfector, NombrePractica, FechaEfectua, Efector } = body;
        console.log(body)
        // Verifica si el prestadorId existe en la tabla Prestador
        const prestadorExists = await prisma.$queryRaw<any[]>`
        SELECT * FROM Prestador WHERE matricula = ${Efector}
    `;

        let nuevaDenuncia;
        if (prestadorExists.length > 0) {
            // Crear denuncia con la relación si el prestador existe
            nuevaDenuncia = await prisma.$executeRaw`
                INSERT INTO Denuncia (motivo, nombrePrestador, especialidad, practica, fechadelsuceso, prestadorId)
                VALUES (${denuncia}, ${NombreEfector}, ${EspecialidadEfector}, ${NombrePractica}, ${FechaEfectua}, ${Efector})
            `;
        } else {
            // Crear denuncia sin la relación si el prestador no existe
            nuevaDenuncia = await prisma.$executeRaw`
                INSERT INTO Denuncia (motivo, nombrePrestador, especialidad, practica, fechadelsuceso,prestadorId)
                VALUES (${denuncia}, ${NombreEfector}, ${EspecialidadEfector}, ${NombrePractica}, ${FechaEfectua}, NULL)
            `;
        }

        return NextResponse.json({ status: 200, message: "Denuncia creada exitosamente", nuevaDenuncia });
    } catch (error) {
        console.error("Error al procesar la solicitud POST:", error);
        return NextResponse.json({ status: 500, message: "Error interno del servidor" });
    }
}