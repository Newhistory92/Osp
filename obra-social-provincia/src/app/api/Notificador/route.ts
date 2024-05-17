import prisma from "../../lib/prisma"
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const dni = searchParams.get('dni');

        // Verificar si se proporcionó el DNI
        if (!dni) {
            return NextResponse.json({ status: 400, message: 'El número de DNI es requerido' });
        }

        // Buscar el afiliado por DNI
        const afiliado = await prisma.afiliado.findFirst({
            where: {
                dni: dni,
            },
        });
        

        // Verificar si se encontró el afiliado
        if (!afiliado) {
            return NextResponse.json({ status: 404, message: 'Afiliado no encontrado' });
        }

        // Devolver la información del afiliado
        return NextResponse.json({ status: 200, message: 'Afiliado encontrado:', afiliado });
    } catch (error: any) {
        console.error('Error al obtener el afiliado:', error);
        return NextResponse.json({ status: 500, message: `Error al obtener el afiliado: ${error.message}` });
    }
}


export async function POST(request: { json: () => any; }) {
    try {
        console.log("Recibida solicitud POST para crear una nueva notificacion");
        const nuevaNotificacion = await request.json();
      
        console.log("Datos de la nueva publicación:", nuevaNotificacion );
        const publicacionCreada = await prisma.notificacion.create({
            data: nuevaNotificacion ,
        });
        console.log("Notificacion creada exitosamente:", nuevaNotificacion );
        
        return NextResponse.json({ status: 200, message: "Notificacionn creada exitosamente", publicacion: nuevaNotificacion  });
    } catch (error:any) {
        console.error("Error al verificar la autenticación del usuario:", error);
        return NextResponse.json({ status: 500, message: `Error al crear la Notificacion: ${error.message}` });
    }
}
