import { NextRequest, NextResponse } from 'next/server';
import { poolPromise, sql } from '../../../lib/mssql';

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const numerodni = searchParams.get('dni');
    console.log(numerodni);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('consultadni', sql.VarChar(8), numerodni)
            .query(`
                SELECT TOP 12 * 
                FROM ExcelenciaDigital.dbo.FacturacionDetalle 
                WHERE Documento = @consultadni 
                ORDER BY FechaEfectua DESC
            `);
        
        if (result.recordset.length === 0) {
            return NextResponse.json({ error: 'Orden de consulta no encontrada' }, { status: 404 });
        }
        
        return NextResponse.json(result.recordset, { status: 200 });
    } catch (err) {
        console.error('Error al obtener las órdenes de consulta:', err);
        return NextResponse.json({ error: 'Error al obtener las órdenes de consulta' }, { status: 500 });
    }
};