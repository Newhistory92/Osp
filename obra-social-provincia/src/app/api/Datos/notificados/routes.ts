import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';  // Asegúrate de tener la instancia de prisma importada correctamente.

export async function GET(req: NextRequest) {
    console.log('Request URL:', req.url);
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const autorId = searchParams.get('autorId');
        const receptorId = searchParams.get('receptorId');

        console.log('autorId:', autorId);
        console.log('receptorId:', receptorId);

        if (!autorId && !receptorId) {
            console.log('Se requiere el ID del autor o el ID del receptor');
            return NextResponse.json({ status: 400, message: 'Se requiere el ID del autor o el ID del receptor' });
        }

        let notificaciones;

        if (autorId) {
            notificaciones = await prisma.notificacion.findMany({
                where: {
                    autorId: autorId,
                },
                include: {
                    autor: true,
                    receptor: true,
                },
            });
        } else if (receptorId) {
            notificaciones = await prisma.notificacion.findMany({
                where: {
                    receptorId: receptorId,
                },
                include: {
                    autor: true,
                    receptor: true,
                },
            });
        }

        if (!notificaciones || notificaciones.length === 0) {
            console.log('No se encontraron notificaciones.');
            return NextResponse.json({ status: 404, message: 'No se encontraron notificaciones.' });
        }

        console.log('Notificaciones encontradas:', notificaciones);

        return NextResponse.json({ status: 200, message: 'Notificaciones encontradas:', notificaciones });
    } catch (error: any) {
        console.error('Error al obtener las notificaciones:', error);
        return NextResponse.json({ status: 500, message: `Error al obtener las notificaciones: ${error.message}` });
    }
}