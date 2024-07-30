import { NextResponse } from "next/server";
import { poolPromise } from '../../../lib/mssql';

export async function GET() {
    try {
        const pool = await poolPromise;
        
        const resultAfiliados = await pool.request().query(`
            SELECT COUNT(*) as count FROM ObraSocial.dbo.Afiliados
        `);
        const countAfiliados = resultAfiliados.recordset[0].count;
        
        const resultPrestadores = await pool.request().query(`
            SELECT COUNT(*) as count FROM ObraSocial.dbo.Prestadores
        `);
        const countPrestadores = resultPrestadores.recordset[0].count;
        
        return NextResponse.json({ status: 200, data: { countAfiliados, countPrestadores } });
    } catch (error: any) {
        console.error('Error al obtener los datos:', error);
        return NextResponse.json({ status: 500, message: `Error al obtener los datos: ${error.message}` });
    }
}
