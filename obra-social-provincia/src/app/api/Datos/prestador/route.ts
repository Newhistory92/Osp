import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { poolPromise, sql } from '../../../lib/mssql';

// export async function GET() {
//     try {
//         const users = await prisma.prestador.findMany();
//         return NextResponse.json(users);
//     } catch (error) {
//         console.error('Error en la función GET para prestador:', error);
//         return NextResponse.json({ status: 400, error: 'Error en el servidor' });
//     }
// }

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


export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const numeroMatricula = searchParams.get('matricula');
   console.log(numeroMatricula)
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('numeroMatricula', sql.VarChar(4), numeroMatricula)
        .query('SELECT * FROM ObraSocial.dbo.Prestadores WHERE codigo = @numeroMatricula');
      
      if (result.recordset.length === 0) {
        return NextResponse.json({ error: 'Prestador not found' }, { status: 404 });
      }
      const prestador = result.recordset[0];
      console.log(prestador)
      const especialidadResult = await pool.request()
      .input('codigoEspecialidad', sql.VarChar(3), prestador.Especialidad)
      .query('SELECT nombre FROM ObraSocial.dbo.Especialidades_Medicas WHERE codigo = @codigoEspecialidad');
      if (especialidadResult.recordset.length === 0) {
        return NextResponse.json({ error: 'Especialidad not found' }, { status: 404 });
      }
  
      const especialidad = especialidadResult.recordset[0].nombre;
      const response = {
        ...prestador,
        especialidad
      };
  
      return NextResponse.json(response);
    } catch (err) {
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
  };