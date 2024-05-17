import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const autorId = searchParams.get('autorId');
        const receptorId = searchParams.get('receptorId');

        // Verificar si se proporcionó el ID del autor o el receptor
        if (!autorId && !receptorId) {
            return NextResponse.json({ status: 400, message: 'El ID del autor o receptor es requerido' });
        }

        let notificaciones;

        // Buscar las notificaciones filtradas por autorId o receptorId
        if (autorId) {
            notificaciones = await prisma.notificacion.findMany({
                where: {
                    autorId: autorId,
                },
            });
        } else if (receptorId !== null) {
            notificaciones = await prisma.notificacion.findMany({
                where: {
                    receptorId: receptorId,
                },
            });
        } else {
            // Manejar el caso cuando receptorId es null
            return NextResponse.json({ status: 400, message: 'El ID del autor o receptor es requerido' });
        }
        // Devolver las notificaciones filtradas
        return NextResponse.json({ status: 200, message: 'Notificaciones encontradas:', notificaciones });
    } catch (error: any) {
        console.error('Error al obtener las notificaciones:', error);
        return NextResponse.json({ status: 500, message: `Error al obtener las notificaciones: ${error.message}` });
    }
}

