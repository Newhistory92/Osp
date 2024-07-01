import prisma from "../../lib/prisma"
import { NextResponse, NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const dni = searchParams.get('dni');
        const matricula = searchParams.get('matricula');

        if (dni) {
            const afiliado = await prisma.afiliado.findFirst({
                where: { dni },
            });

            if (!afiliado) {
                return NextResponse.json({ status: 404, message: 'Afiliado no encontrado' });
            }

            return NextResponse.json({ status: 200, message: 'Afiliado encontrado', afiliado });
        } 
        
        if (matricula) {
            const prestador = await prisma.prestador.findFirst({
                where: { matricula },
            });

            if (!prestador) {
                return NextResponse.json({ status: 404, message: 'Prestador no encontrado' });
            }

            return NextResponse.json({ status: 200, message: 'Prestador encontrado', prestador });
        } 

        return NextResponse.json({ status: 400, message: 'DNI o Matrícula es requerido' });

    } catch (error: any) {
        console.error('Error al obtener el usuario:', error);
        return NextResponse.json({ status: 500, message: `Error al obtener el usuario: ${error.message}` });
    }
}


export async function POST(request: NextRequest) {
    try {
        console.log("Recibida solicitud POST para crear una nueva notificación");
        const nuevaNotificacion = await request.json();

        console.log("Datos de la nueva notificación:", nuevaNotificacion);

        const { titulo, contenido, url, autorId, receptorId, receptorPrestadorId } = nuevaNotificacion;

        if (!autorId || (!receptorId && !receptorPrestadorId)) {
            throw new Error("Faltan el ID del autor o del receptor");
        }

        const notificacionCreada = await prisma.notificacion.create({
            data: {
                titulo,
                contenido,
                url: url || null,
                autor: {
                    connect: { id: autorId },
                },
                receptor: {
                    connect: { id: receptorId },
                },
            },
        });

        console.log("Notificación creada exitosamente:", notificacionCreada);
        return NextResponse.json({ status: 200, message: "Notificación creada exitosamente", notificacion: notificacionCreada });
    } catch (error: any) {
        console.error("Error al crear la notificación:", error);
        return NextResponse.json({ status: 500, message: `Error al crear la notificación: ${error.message}` });
    }

}





// export async function POST(request: NextRequest) {
//     try {
//         console.log("Recibida solicitud POST para crear una nueva notificación");
//         const nuevaNotificacion = await request.json();

//         console.log("Datos de la nueva notificación:", nuevaNotificacion);

//         const { titulo, contenido, url, autorId, receptorId, receptorPrestadorId } = nuevaNotificacion;

//         if (!autorId || (!receptorId && !receptorPrestadorId)) {
//             throw new Error("Faltan el ID del autor o del receptor");
//         }

//         const data = {
//             titulo,
//             contenido,
//             url: url || null,
//             autor: {
//                 connect: { id: autorId },
//             }
//         };

//         if (receptorId) {
//             data.receptor = { connect: { id: receptorId } };
//         }

//         if (receptorPrestadorId) {
//             data.receptorPrestador = { connect: { id: receptorPrestadorId } };
//         }

//         const notificacionCreada = await prisma.notificacion.create({
//             data
//         });

//         console.log("Notificación creada exitosamente:", notificacionCreada);
//         return NextResponse.json({ status: 200, message: "Notificación creada exitosamente", notificacion: notificacionCreada });
//     } catch (error: any) {
//         console.error("Error al crear la notificación:", error);
//         return NextResponse.json({ status: 500, message: `Error al crear la notificación: ${error.message}` });
//     }
// }
