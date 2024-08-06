import React, { useState, useEffect,useRef } from 'react';
import { CarouselDefault } from './CarouselCard';
import { OrdenData , UserInfo} from '@/app/interfaces/interfaces';
import { useAppSelector,useAppDispatch } from "../../../hooks/StoreHook"
import {setLoading} from '@/app/redux/Slice/loading';
import { Toast } from 'primereact/toast';



   
const Ordenes = () => {
    const [ordenesData, setOrdenesData] = useState<OrdenData[]>([]);
    const ordenes = useAppSelector(state => state.navbarvertical);
    const currentUser = useAppSelector((state: { user: { currentUser: UserInfo | null; }; }) => state.user.currentUser?.grupFamiliar);
    const dispatch = useAppDispatch(); 
    const toast = useRef<Toast>(null);

    useEffect(() => {
      if (!currentUser) {
        dispatch(setLoading(false));
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `ocurrió un error,ingresa a su Grupo Familiar y retome su consulta` , life: 3000 });
        return;
      }
  
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
  
      if (ordenes ) {
        fetchOrdenes();
    }
}, [ dispatch, ordenes]);

    return (
        <div>
            
               <CarouselDefault ordenesData={ordenesData} />
               <Toast ref={toast} position="bottom-center" />
        </div>
    );
};

export default Ordenes;