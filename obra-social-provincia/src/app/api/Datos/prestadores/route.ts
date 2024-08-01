import {  NextResponse } from "next/server";
import { poolPromise } from '../../../lib/mssql';


export async function GET() {
    try {
      const pool = await poolPromise;

      // Obtener prestadores de la nueva base de datos
      const prestadoresPaginaObraSocial = await pool.request().query(`
        SELECT * FROM paginaobrasocial.dbo.Prestador
      `);

      // Obtener prestadores de la antigua base de datos
      const prestadoresObraSocial = await pool.request().query(`
        SELECT * FROM ObraSocial.dbo.Prestadores
      `);

      // Obtener todas las especialidades
      const especialidadesResult = await pool.request().query(`
        SELECT codigo, nombre FROM ObraSocial.dbo.Especialidades_Medicas
      `);

      if (!prestadoresPaginaObraSocial.recordset || !prestadoresObraSocial.recordset || !especialidadesResult.recordset) {
        return NextResponse.json({ status: 500, message: 'Error al obtener los prestadores o especialidades' });
      }

      // Crear un mapa de especialidades
      const especialidadesMap = new Map();
      especialidadesResult.recordset.forEach((especialidad: { codigo: any; nombre: any; }) => {
        especialidadesMap.set(especialidad.codigo, especialidad.nombre);
      });

      // Crear un mapa de prestadores por matricula de la nueva base de datos
      const prestadoresMap = new Map();
      prestadoresPaginaObraSocial.recordset.forEach((prestador: { matricula: any; }) => {
        prestadoresMap.set(prestador.matricula, prestador);
      });

      // Combinar datos de ambas bases de datos y agregar nombre de especialidad
      const combinedPrestadores = prestadoresObraSocial.recordset.map((prestador: { Codigo: any; Especialidad: any; }) => {
        const matchedPrestador = prestadoresMap.get(prestador.Codigo);
        const especialidadNombre = especialidadesMap.get(prestador.Especialidad) || 'Especialidad no encontrada';

        const prestadorConEspecialidad = matchedPrestador ? { ...matchedPrestador, especialidad: especialidadNombre } : { ...prestador, especialidad: especialidadNombre };

        return prestadorConEspecialidad;
      });

      return NextResponse.json({ status: 200, data: combinedPrestadores });
    } catch (error: any) {
      console.error('Error al obtener los prestadores:', error);
      return NextResponse.json({ status: 500, message: `Error al obtener los prestadores: ${error.message}` });
    }
  }