import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Notificacion } from '@/app/interfaces/interfaces';
import parse from 'html-react-parser';
import { Dialog } from 'primereact/dialog';
interface Props {
    autorId: string | null;
}

export default function NotificadosList({ autorId }: Props) {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedNotification, setSelectedNotification] = useState<Notificacion | null>(null);

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
                console.log(data)
                setNotificaciones(data);
            } catch (error) {
                console.error('Error inesperado al obtener las notificaciones del autor:', error);
            }
        };
        getNotificaciones();
    }, [autorId]);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;


    const handleRowClick = (notification: Notificacion) => {
        setSelectedNotification(notification);
        setVisible(true);
    };

    return (
        <div className="card">
            <DataTable
                value={notificaciones}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                header="Notificaciones"
            >
                <Column field="titulo" header="Título" sortable style={{ width: '20%' }}></Column>
                <Column
                    field="contenido"
                    header="Contenido"
                    sortable
                    style={{ width: '20%' }}
                    body={(rowData) => (
                        <Button icon="pi pi-external-link" onClick={() => handleRowClick(rowData)}>
                        {parse(rowData.contenido.slice(0, 20))}
                    </Button>
                        
                    )}
                    
                ></Column>
                <Column 
                field="autor" 
                 header="Autor"
                 sortable style={{ width: '15%' }}
                 body={(rowData) => `${rowData.autor.name} ${rowData.autor.apellido}`}>
                   
                 </Column>
                <Column
                    field="receptor"
                    header="Receptor"
                    sortable
                    style={{ width: '15%' }}
                    body={(rowData) => `${rowData.receptor.name} ${rowData.receptor.apellido} (DNI:${rowData.receptor.dni})`}
                ></Column>
                <Column field="status" header="Estado" sortable style={{ width: '10%' }}></Column>
                <Column
                    field="createdAt"
                    header="Enviado"
                    sortable
                    style={{ width: '20%' }}
                    body={(rowData) => format(new Date(rowData.createdAt), 'eeee d/MM/yyyy', { locale: es })}
                ></Column>
            </DataTable>
            {selectedNotification && (
                  <div className="card flex justify-content-center">
                <Dialog
                    header={selectedNotification.titulo}
                    visible={visible}
                    onHide={() => setVisible(false)}
                    style={{ width: '50vw' }}
                    breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                    
                >
                    <div>{parse(selectedNotification.contenido)}</div>
                </Dialog>
                </div>
            )}
        </div>
    );
}

