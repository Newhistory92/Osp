import React, { useState, useEffect } from 'react';
import jsonData from '../../../../../OrdenesPrestador.json';
import { CarouselDefault } from './CarouselCard';
import { OrdenData } from '@/app/interfaces/interfaces';


const Ordenes = () => {
    const [ordenes, setOrdenes] = useState<OrdenData[]>([]);

    useEffect(() => {
        // Simulación de la solicitud a la base de datos para obtener las órdenes
        setOrdenes(jsonData.slice(0, 5)); // Limitar a las primeras 5 órdenes
    }, []);

    return (
        <div  >
            <CarouselDefault ordenes={ordenes}
             />
        </div>
    );
};


export default Ordenes;

