import React, { useState, useEffect } from 'react';
import { CarouselDefault } from './CarouselCard';
import { OrdenData , UserInfo} from '@/app/interfaces/interfaces';
import { useAppSelector,useAppDispatch } from "../../../hooks/StoreHook"
import {setLoading} from '@/app/redux/Slice/loading';
import Loading from '@/app/components/Loading/loading';



   
const Ordenes = () => {
    const [ordenesData, setOrdenesData] = useState<OrdenData[]>([]);
    const ordenes = useAppSelector(state => state.navbarvertical);
    const currentUser = useAppSelector((state: { user: { currentUser: UserInfo | null; }; }) => state.user.currentUser?.grupFamiliar);
    const dispatch = useAppDispatch(); 
  
    console.log(ordenesData);
  
    if (!currentUser) {
      return <div><Loading /></div>;
    }
  
    useEffect(() => {
      const fetchOrdenes = async () => {
        
        dispatch(setLoading(true));
        try {
          const ordenesDataPromises = currentUser.map(async (dni: string) => {
            const response = await fetch(`/api/Datos/ordenes?dni=${dni}`);
            const data = await response.json();
            return data;
          });
  
          const allOrdenesData = await Promise.all(ordenesDataPromises);
          const concatenatedOrdenesData = allOrdenesData.flat().filter((value, index, self) =>
            index === self.findIndex((t) => t.IdFacturacion === value.IdFacturacion)
        );
          setOrdenesData(concatenatedOrdenesData);
        } catch (error) {
          console.error('Error fetching ordenes:', error);
        } finally {
          dispatch(setLoading(false));
        }
      };
  
      if (ordenes && currentUser) {
        fetchOrdenes();
    }
}, [currentUser, dispatch]);

    return (
        <div>
            
               <CarouselDefault ordenesData={ordenesData} />
           
        </div>
    );
};

export default Ordenes;