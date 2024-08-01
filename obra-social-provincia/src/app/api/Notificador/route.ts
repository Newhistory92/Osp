import prisma from "../../lib/prisma"
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const dni = searchParams.get('dni');
        const matricula = searchParams.get('matricula');

        if (dni) {
            const afiliado: any[] = await prisma.$queryRaw`
                SELECT * FROM Afiliado WHERE dni = ${dni}
            `;

            if (afiliado.length === 0) {
                return NextResponse.json({ status: 404, message: 'Afiliado no encontrado' });
            }

            return NextResponse.json({ status: 200, message: 'Afiliado encontrado', afiliado: afiliado[0] });
        } 
        
        if (matricula) {
            const prestador: any[] = await prisma.$queryRaw`
                SELECT * FROM Prestador WHERE matricula = ${matricula}
            `;

            if (prestador.length === 0) {
                return NextResponse.json({ status: 404, message: 'Prestador no encontrado' });
            }

            return NextResponse.json({ status: 200, message: 'Prestador encontrado', prestador: prestador[0] });
        } 

        return NextResponse.json({ status: 400, message: 'DNI o Matrícula es requerido' });

    } catch (error: any) {
        console.error('Error al obtener el usuario:', error);
        return NextResponse.json({ status: 500, message: `Error al obtener el usuario: ${error.message}` });
    }
}


export async function POST(request: NextRequest) {
    try {
        const currentDateTime = new Date().toISOString()
        //console.log("Recibida solicitud POST para crear una nueva notificación");
        const nuevaNotificacion = await request.json();

        

        const { titulo, contenido, url, autorId, receptorId, receptorPrestadorId } = nuevaNotificacion;

        if (!autorId || (!receptorId && !receptorPrestadorId)) {
            throw new Error("Faltan el ID del autor o del receptor");
        }

        let notificacionCreada;
        
        if (receptorId) {
            notificacionCreada = await prisma.$executeRaw`
                INSERT INTO Notificacion (titulo, contenido, url, autorId, receptorId,updatedAt)
                VALUES (${titulo}, ${contenido}, ${url || null}, ${autorId}, ${receptorId},${currentDateTime})
            `;
        } else {
            notificacionCreada = await prisma.$executeRaw`
                INSERT INTO Notificacion (titulo, contenido, url, autorId, receptorPrestadorId,updatedAt)
                VALUES (${titulo}, ${contenido}, ${url || null}, ${autorId}, ${receptorPrestadorId},${currentDateTime})
            `;
        }

        //console.log("Notificación creada exitosamente:", notificacionCreada);
        return NextResponse.json({ status: 200, message: "Notificación creada exitosamente", notificacion: notificacionCreada });
    } catch (error: any) {
        console.error("Error al crear la notificación:", error);
        return NextResponse.json({ status: 500, message: `Error al crear la notificación: ${error.message}` });
    }
}
