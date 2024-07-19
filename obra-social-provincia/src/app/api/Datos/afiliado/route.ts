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
  const doctit = searchParams.get('doctit');

  try {
    const pool = await poolPromise;
    let result;

    // Seleccionar la consulta basada en si viene 'doctit' o 'dni'
    if (doctit) {
      result = await pool.request()
        .input('numerodni', sql.VarChar(8), doctit)
        .query('SELECT * FROM ObraSocial.dbo.Afiliados WHERE Doctit = @numerodni');
    } else {
      result = await pool.request()
        .input('numerodni', sql.VarChar(8), numerodni)
        .query('SELECT * FROM ObraSocial.dbo.Afiliados WHERE Codigo = @numerodni');
    }

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Afiliado not found' }, { status: 404 });
    }

    const afiliados = result.recordset;

    // Obtener el nombre de la dependencia usando el valor de Barra del primer afiliado
    const barraResult = await pool.request()
      .input('codigoBarra', sql.VarChar(3), afiliados[0].Barra)
      .query('SELECT nombre FROM ObraSocial.dbo.barra_osp WHERE Codigo = @codigoBarra');

    if (barraResult.recordset.length === 0) {
      return NextResponse.json({ error: 'Dependencia not found' }, { status: 404 });
    }

    const dependencia = barraResult.recordset[0].nombre;

    // Obtener información de carnet_dbf22 y VTOS_dbf22 para cada afiliado
    const promises = afiliados.map(async (afiliado: any) => {
      let razonBaja = null;

      // Obtener la razón de la baja usando el CodBaja del afiliado
      if (afiliado.CodBaja && afiliado.CodBaja.trim() !== '') {
        const bajaResult = await pool.request()
          .input('codigoBaja', sql.VarChar(3), afiliado.CodBaja)
          .query('SELECT nombre FROM migrada.dbo.bajas WHERE codigo = @codigoBaja');

        if (bajaResult.recordset.length > 0) {
          razonBaja = bajaResult.recordset[0].nombre;
        }
      }

      const carnetResult = await pool.request()
      .input('codigoAfiliado', sql.VarChar(8), afiliado.Codigo)
      .query(`
        SELECT TOP 1 FECVENCI 
        FROM ObraSocial.dbo.carnet_dbf22 
        WHERE CODIGO = @codigoAfiliado 
        ORDER BY VERSIONADO DESC
      `);

    const carnetData = carnetResult.recordset.length > 0 ? carnetResult.recordset[0] : null;

    const vtosResult = await pool.request()
    .input('codigoAfiliado', sql.VarChar(8), afiliado.Codigo)
    .query(`
      SELECT TOP 1 VTO, MOTIVO 
      FROM ObraSocial.dbo.VTOS_dbf22 
      WHERE CODIGO = @codigoAfiliado AND ACTIVADO = 1
    `);
      const vtosData = vtosResult.recordset.length > 0 ? vtosResult.recordset[0] : null;
      return {
        ...afiliado,
        dependencia,
        razonBaja,
        FecVenciCarnet: carnetData ? carnetData.FECVENCI : null,
        VTOParcial: vtosData ? vtosData.VTO : null,
        Motivo: vtosData && vtosData.MOTIVO.trim() !== '' ? vtosData.MOTIVO : 'Consulte en Afiliaciones en Sede Central: Agustin Gnecco 360 (S)- 5400 | San Juan, Argentina o en la Delegacion Departamental mas Cercada a su Domicilio'
      };
    });

    const response = await Promise.all(promises);
    return NextResponse.json(response);
  } catch (err) {
    console.error("Database query failed:", err);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
};