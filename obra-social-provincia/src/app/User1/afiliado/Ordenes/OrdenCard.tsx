import React, { useState } from 'react';
import Denuncia from '../Denuncia';
import { OrdenData } from '@/app/interfaces/interfaces';

const Orden: React.FC<OrdenData> = ({ numeroOrden, fechaUso, nombreMedico, apellidoMedico, especialidad, tipoBono, numeroPrestador, nombreAfiliado }) => {
    const [showDenuncia, setShowDenuncia] = useState(false);

    const toggleDenuncia = () => {
        setShowDenuncia(!showDenuncia);
    };

    return (
        <div className="max-w-sm p-6 rounded-xl bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
            <h5><small className="ms-2 font-semibold text-gray-500 dark:text-gray-400">Prestador</small></h5>
            <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                {nombreMedico}
                <span className="text-blue-600 dark:text-blue-500"> {apellidoMedico}</span>
                <span className="bg-blue-100 text-blue-800 text-base font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2 " style={{ maxWidth: '10%', overflow: 'hidden' }}>{numeroPrestador}</span>
            </h1>
            <blockquote className="text-xl italic font-semibold text-right text-gray-900 dark:text-white">
                <p>Número de Orden: {numeroOrden}</p>
            </blockquote>
            <h4 className="text-base font-bold dark:text-white">Bono: {tipoBono}</h4>
            <h4 className="text-base font-bold dark:text-white">Fecha de Uso: {fechaUso}</h4>
            <h4 className="text-base font-bold dark:text-white">Afiliado: {nombreAfiliado}</h4>
            <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={toggleDenuncia} // Agregar función para alternar la visibilidad de Denuncia
            >
                Experiencia Prestacional
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
            </button>
            {showDenuncia && <Denuncia  closeModal={toggleDenuncia} />} {/* Renderizar Denuncia si showDenuncia es true */}
        </div>
    );
};

export default Orden;
