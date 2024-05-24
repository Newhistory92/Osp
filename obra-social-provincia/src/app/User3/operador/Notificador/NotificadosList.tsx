import React, { useState, useEffect } from 'react';
import { OrderList } from 'primereact/orderlist';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'
import { Notificacion } from '@/app/interfaces/interfaces';
interface Props {
    autorId: string | null;
  }

  export default function NotificadosList({ autorId }: Props) {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

    useEffect(() => {
        const getNotificaciones = async () => {
          try {
            const response = await fetch(`/api/datos/notificados?receptorId=${autorId}`,  {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error('Error al obtener las notificaciones');
            }
            const data = await response.json();
            console.log(data);
            if (response.ok) {
              
              setNotificaciones(data);
            }
          } catch (error) {
            console.error('Error al obtener las notificaciones:', error);
            throw error;
          }
        };
    
        getNotificaciones(); // Llama a la función getNotificaciones para obtener las notificaciones cuando el componente se monta
      }, [autorId]);

    const itemTemplate = (item: Notificacion) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <span className="font-bold">{item.titulo}</span>
                    <div className="flex align-items-center gap-2">
                        <span>Autor: {item.autor}</span>
                        <span>Receptor: {item.receptor}</span>
                        <span>Estado: {item.status}</span>
                        <span>Enviado:  {`Actualizado: ${format(new Date(item.createdAt), 'eeee d/MM/yyyy', { locale: es })}`}</span>
                    </div>
                </div>
                <span className="font-bold text-900">Contenido: {item.contenido}</span>
            </div>
        );
    };

    return (
        <div className="card xl:flex xl:justify-content-center">
            <OrderList
                dataKey="id"
                value={notificaciones}
                onChange={(e) => setNotificaciones(e.value)}
                itemTemplate={itemTemplate}
                header="Notificaciones"
                filter
                filterBy="titulo"
            ></OrderList>
        </div>
    );
}
