import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


export async function GET() {
    try {
        const users = await prisma.prestador.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error en la función GET para prestador:', error);
        return NextResponse.json({ status: 400, error: 'Error en el servidor' });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const id = body.id
        const  tipo =body.tipo
        console.log(body)
        if (!id) {
            return NextResponse.json({ status: 400, error: 'ID is required' });
        }
        const updatedPrestador = await prisma.prestador.update({
            where: { id },
            data: {  tipo },
        });
        return NextResponse.json(updatedPrestador);
    } catch (error) {
        console.error('Error en la función PUT para prestador:', error);
        return NextResponse.json({ status: 400, error: 'Error en el servidor' });
    }
}