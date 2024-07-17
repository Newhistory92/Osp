import React, { useState, useEffect } from 'react';
import { CarouselDefault } from './CarouselCard';
import { OrdenData , UserInfo} from '@/app/interfaces/interfaces';
import { useAppSelector,useAppDispatch } from "../../../hooks/StoreHook"
import {setLoading} from '@/app/redux/Slice/loading';
import Loading from '@/app/components/Loading/loading';



const Ordenes = () => {
    const [ordenesData, setOrdenesData] = useState<OrdenData[]>([]);
    const ordenes = useAppSelector(state => state.navbarvertical);
    const currentUser = useAppSelector((state: { user: { currentUser: UserInfo | null; }; }) => state.user.currentUser);
    console.log("este estado global esta en el ordenes",currentUser)
      if (!currentUser) {
        return <div><Loading/></div>;
      }
    
      // Verificar si currentUser es un array o no
      const userData = Array.isArray(currentUser) ? currentUser[0] : currentUser;
    

    console.log( currentUser)

  
    useEffect(() => {
        const fetchOrdenes = async () => {
         setLoading(true);
            try {
                const response = await fetch(`/api/Datos/ordenes?dni=${userData.dni}`);
                const data = await response.json();
                console.log("respuesta del backend",data)
                setOrdenesData(data);
            } catch (error) {
                console.error("Error al obtener las órdenes:", error);
            } finally {
                setLoading(false);
            }
            if (ordenes) {
                fetchOrdenes();
            }
        };

    }, [ordenes, userData.dni]);

    return (
        <div>
            
                <CarouselDefault ordenes={ordenesData} />
           
        </div>
    );
};

export default Ordenes;