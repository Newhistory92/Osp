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
