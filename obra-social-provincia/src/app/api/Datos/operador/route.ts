import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";




export async function GET() {
    try {
        const users = await prisma.operador.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error en la función GET para operador:', error);
        return NextResponse.json({ status: 400, error: 'Error en el servidor' });
    }
}



export async function PUT(request: NextRequest) {
    try {
        // Parsear el cuerpo de la solicitud para obtener los datos a actualizar
        const body = await request.json();
        const role = body.role;
         const id = body.id
        // Verificar si el usuario existe en la base de datos
        const existingUser = await prisma.operador.findUnique({
            where: {
                id: id
            },
        });

        if (!existingUser) {
            return NextResponse.json({ status: 404, error: 'Usuario no encontrado' });
        }

        // Actualizar el rol del usuario
        const updatedUser = await prisma.operador.update({
            where: {
                id:id
            },
            data: {
                role: role,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error en la función PUT para operador:', error);
        return NextResponse.json({ status: 400, error: 'Error en el servidor' });
    }
}