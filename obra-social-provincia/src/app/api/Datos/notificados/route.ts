import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; 

export async function GET(req: NextRequest) {
    try {
        // const url = new URL(req.url);
        // const searchParams = new URLSearchParams(url.searchParams);
        // const autorId = searchParams.get('autorId');
        // const receptorId = searchParams.get('receptorId');
        const { searchParams } = new URL(req.url);  
        const autorId = searchParams.get('autorId');
        const receptorId = searchParams.get('receptorId');
    
        if (!autorId && !receptorId) {
            return NextResponse.json({ error: "autorId o receptorId son necesarios" }, { status: 400 });
        }

        let notifications;

        if (autorId) {
            const result = await prisma.$queryRaw`
                SELECT n.*, a.name as autorName, r.name as receptorName,  r.dni as receptorDni
                FROM Notificacion n
                JOIN Operador a ON n.autorId = a.id
                JOIN Afiliado r ON n.receptorId = r.id
                WHERE n.autorId = ${autorId}
                ORDER BY n.createdAt DESC
            `;
            notifications = result;
        } else if (receptorId) {
            const result = await prisma.$queryRaw`
                SELECT n.*, a.name as autorName, r.name as receptorName, r.dni as receptorDni
                FROM Notificacion n
                JOIN Operador a ON n.autorId = a.id
                JOIN Afiliado r ON n.receptorId = r.id
                WHERE n.receptorId = ${receptorId}
                ORDER BY n.createdAt DESC
            `;
            notifications = result;
        }

        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
        return NextResponse.json({ error: "Error al obtener las notificaciones" }, { status: 500 });
    }
}




export async function PUT(req: NextRequest) {
 
    
    try {
        const { id, status } = await req.json();
       // console.log("Parsed request body:", { id, status });

        // Actualiza el estado de la notificación
        await prisma.$executeRaw`
            UPDATE Notificacion
            SET status = ${status}
            WHERE id = ${id}
        `;

        const updatedNotification = await prisma.$queryRaw`
            SELECT * FROM Notificacion WHERE id = ${id}
        `;

        //console.log("Notification updated:", updatedNotification);

        return new NextResponse(JSON.stringify(updatedNotification), { status: 200 });
    } catch (error:any) {
        console.error("Error updating notification:", error);
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
    }
}