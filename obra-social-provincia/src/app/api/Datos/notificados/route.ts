import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';  // Asegúrate de tener la instancia de prisma importada correctamente.

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const autorId = searchParams.get('autorId');
        const receptorId = searchParams.get('receptorId');

        console.log('autorId:', autorId);
        console.log('receptorId:', receptorId);
        
        if (!autorId && !receptorId) {
            return NextResponse.json({ error: "autorId o receptorId son necesarios" }, { status: 400 });
        }

        let notifications;

        if (autorId) {
            notifications = await prisma.notificacion.findMany({
                where: {
                    autorId: autorId,
                },
                orderBy: { createdAt: 'desc' },
                include: {
                  autor: {
                        select: {
                            name: true,
                            apellido: true,
                           
                        }
                    },
                    receptor: {
                            select: {
                                name: true,
                                apellido: true,
                                dni:true,
                               
                            }
                        }
                    
                }
                
            });
            
        } else if (receptorId) {
            notifications = await prisma.notificacion.findMany({
                where: {
                    receptorId: receptorId,
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
        return NextResponse.json({ error: "Error al obtener las notificaciones" }, { status: 500 });
    }
}
