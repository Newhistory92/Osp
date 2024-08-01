
import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../lib/prisma"


export async function GET(req: NextRequest) {
    try {
        const denuncias = await prisma.$queryRaw`
            SELECT * FROM Denuncia
        `;
        
        return NextResponse.json({ status: 200, data: denuncias });
    } catch (error) {
        console.error("Error al obtener las denuncias:", error);
        return NextResponse.json({ status: 500, message: "Error interno del servidor" });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { denuncia, NombreEfector, EspecialidadEfector, NombrePractica, FechaEfectua, Efector } = body;
       
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


export async function PUT(req: NextRequest) {
    try {
   
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const id = searchParams.get('id');       
        const { status } = await req.json();
        if (status !== 'Leido') {
            return NextResponse.json({ status: 400, message: "Estado no válido" });
        }
        await prisma.$executeRawUnsafe(`
            UPDATE Denuncia
            SET status = 'Leido'
            WHERE id = ${Number(id)}
        `);

        return NextResponse.json({ status: 200, message: "Denuncia actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la denuncia:", error);
        return NextResponse.json({ status: 500, message: "Error interno del servidor" });
    }
}