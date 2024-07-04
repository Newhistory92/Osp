import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { poolPromise, sql } from '../../../lib/mssql';

// export async function GET() {
//     try {
//         const users = await prisma.afiliado.findMany();
//         return NextResponse.json(users);
//     } catch (error) {
//         console.error('Error en la función GET para afiliado:', error);
//         return NextResponse.json({ status: 400, error: 'Error en el servidor' });
//     }
// }



export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const numerodni = searchParams.get('dni');
    console.log(numerodni);
    
    try {
      const pool = await poolPromise;
  
      // Obtener el afiliado usando el DNI
      const result = await pool.request()
        .input('numerodni', sql.VarChar(8), numerodni)
        .query('SELECT * FROM ObraSocial.dbo.Afiliados WHERE Codigo = @numerodni');
  
      if (result.recordset.length === 0) {
        return NextResponse.json({ error: 'Afiliado not found' }, { status: 404 });
      }
  
      const afiliado = result.recordset[0];
      console.log(afiliado);
  
      // Obtener el nombre de la dependencia usando el valor de Barra
      const barraResult = await pool.request()
        .input('codigoBarra', sql.VarChar(3), afiliado.Barra)
        .query('SELECT nombre FROM ObraSocial.dbo.barra_osp WHERE Codigo = @codigoBarra');
  
      if (barraResult.recordset.length === 0) {
        return NextResponse.json({ error: 'Dependencia not found' }, { status: 404 });
      }
  
      const dependencia = barraResult.recordset[0].nombre;
  
      // Obtener la razón de la baja usando el CodBaja
      let razonBaja = null;
      if (afiliado.CodBaja.trim() !== '') {
        const bajaResult = await pool.request()
          .input('codigoBaja', sql.VarChar(3), afiliado.CodBaja)
          .query('SELECT nombre FROM migrada.dbo.bajas WHERE codigo = @codigoBaja');
  
        if (bajaResult.recordset.length > 0) {
          razonBaja = bajaResult.recordset[0].nombre;
        }
      }
  
      const response = {
        ...afiliado,
        dependencia,
        razonBaja
      };
  
      return NextResponse.json(response);
    } catch (err) {
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
  };
  