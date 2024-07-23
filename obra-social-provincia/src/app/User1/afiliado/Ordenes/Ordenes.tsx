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
    const dispatch = useAppDispatch(); // Si necesitas despachar alguna acción

    console.log(ordenesData)
      if (!currentUser) {
        return <div><Loading/></div>;
      }
    
      // Verificar si currentUser es un array o no
      const userData = Array.isArray(currentUser) ? currentUser[0] : currentUser;
    


      useEffect(() => {
        const fetchOrdenes = async () => {
            if (ordenes && userData.dni) {
                dispatch(setLoading(true));
                try {
                    const response = await fetch(`/api/Datos/ordenes?dni=${ userData.dni}`);
                    const data = await response.json();
                    setOrdenesData(data);
                } catch (error) {
                    console.error('Error fetching ordenes:', error);
                } finally {
                    dispatch(setLoading(false));
                }
            }
        };
        fetchOrdenes();
    }, [ordenes, userData.dni, dispatch]);
     

    return (
        <div>
            
               <CarouselDefault ordenesData={ordenesData} />
           
        </div>
    );
};

export default Ordenes;