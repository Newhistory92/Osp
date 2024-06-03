import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Notificacion } from '@/app/interfaces/interfaces';

interface Props {
    autorId: string | null;
}

export default function NotificadosList({ autorId }: Props) {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
console.log(notificaciones)
    useEffect(() => {
        const getNotificaciones = async () => {
            try {
                const response = await fetch(`/api/Datos/notificados?autorId=${autorId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al obtener las notificaciones del autor');
                }
                const data = await response.json();
                setNotificaciones(data);
            } catch (error) {
                console.error('Error inesperado al obtener las notificaciones del autor:', error);
            }
        };
        getNotificaciones();
    }, [autorId]);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    return (
        <div className="card">
            <DataTable
                value={notificaciones}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                header="Notificaciones"
            >
                <Column field="titulo" header="Título" sortable style={{ width: '20%' }}></Column>
                <Column field="contenido" header="Contenido" sortable style={{ width: '20%' }}></Column>
                <Column field="autor.name" header="Autor" sortable style={{ width: '15%' }}></Column>
                <Column field="receptor.name" header="Receptor" sortable style={{ width: '15%' }}></Column>
                <Column field="status" header="Estado" sortable style={{ width: '10%' }}></Column>
                <Column
                    field="createdAt"
                    header="Enviado"
                    sortable
                    style={{ width: '20%' }}
                    body={(rowData) => format(new Date(rowData.createdAt), 'eeee d/MM/yyyy', { locale: es })}
                ></Column>
            </DataTable>
        </div>
    );
}

