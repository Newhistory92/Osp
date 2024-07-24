import React, { useState } from 'react';
import Denuncia from '../Denuncia';
import { OrdenData } from '@/app/interfaces/interfaces';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {  addReportDenuncia } from '@/app/redux/Slice/denunciaSlice';
import { useAppSelector,useAppDispatch } from '@/app/hooks/StoreHook';


const Orden: React.FC<OrdenData> = ({ Numero, FechaEfectua,  NombreEfector, EspecialidadEfector,  NombrePractica,   Cantidad, Nombre,Efector,IdFacturacion}) => {
    const [showDenuncia, setShowDenuncia] = useState(false);
    const reportedIds = useAppSelector((state) => state.denuncia.reportDenuncia);
    const hasReported = Array.isArray(reportedIds) && reportedIds.includes(IdFacturacion);
    const dispatch = useAppDispatch();
   

    const capitalizeWords = (str: string) => {
        return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    };

    const handleDenunciaSuccess = () => {
        
        setShowDenuncia(false);
    };



    return (
        <div className="max-w-sm p-6 rounded-xl bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
            <h5><small className="ms-2 font-semibold text-gray-500 dark:text-gray-400">Prestador</small></h5>
            <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                {  capitalizeWords(NombreEfector)}
                
                <span className="bg-blue-100 text-blue-800 text-base font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2 " style={{ maxWidth: '10%', overflow: 'hidden' }}>{EspecialidadEfector}</span>
            </h1>
            <blockquote className="text-xl italic font-semibold text-right text-gray-900 dark:text-white">
                <p>Número de Orden: {Numero}  &nbsp;&nbsp; Cantidad:{ Cantidad}</p>
            </blockquote>
            <h4 className="text-base font-bold dark:text-white">Bono: { capitalizeWords(NombrePractica)}</h4>
            <h4 className="text-base font-bold dark:text-white">Fecha de Uso: {format(new Date( FechaEfectua), 'eeee d/MM/yyyy', { locale: es })}</h4>
            <h4 className="text-base font-bold dark:text-white">Afiliado: { capitalizeWords(Nombre)}</h4>
            <button
                onClick={() => setShowDenuncia(true)}
                disabled={hasReported}
                className={`rounded text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium text-sm px-3 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 ${hasReported ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Experiencia Prestacional
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
            </button>
            {showDenuncia && <Denuncia 
                closeModal={() =>  setShowDenuncia(false)}
                IdFacturacion={IdFacturacion}
                NombreEfector={NombreEfector}
                EspecialidadEfector={EspecialidadEfector}
                FechaEfectua={FechaEfectua}
                NombrePractica={NombrePractica}
                Efector={Efector}
                onSuccess={() => setShowDenuncia(false)}
            />}
        </div>
    );
};

export default Orden;
