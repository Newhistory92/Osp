import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { poolPromise, sql } from '../../../lib/mssql';







// export async function GET() {
//     try {
//         const users = await prisma.operador.findMany();
//         return NextResponse.json(users);
//     } catch (error) {
//         console.error('Error en la función GET para operador:', error);
//         return NextResponse.json({ status: 400, error: 'Error en el servidor' });
//     }
// }



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



export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const numeroOperador = searchParams.get('numeroOperador');

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('numeroOperador', sql.VarChar(3), numeroOperador)
            .query('SELECT * FROM migrada.dbo.Operadores WHERE codigo = @numeroOperador');
        if (result.recordset.length === 0) {
         
            return NextResponse.json({ error: 'Operador not found' }, { status: 404 });
        }
        return NextResponse.json(result.recordset[0]);
    } catch (err) {
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
};