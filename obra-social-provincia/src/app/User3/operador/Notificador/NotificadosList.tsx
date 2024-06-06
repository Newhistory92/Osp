
// million-ignore
import React, { useState, useEffect } from 'react';
import { DataTable,DataTableFilterMeta  } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Notificacion } from '@/app/interfaces/interfaces';
import parse from 'html-react-parser';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
interface Props {
    autorId: string | null;
}
const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: 'contains' },
};
const NotificadosList = ({ autorId }: Props) => {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedNotification, setSelectedNotification] = useState<Notificacion | null>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

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
        if (autorId) {
            getNotificaciones();
        }
    }, [autorId]);

    const getSeverity = (value: string) => {
        switch (value) {
            case 'Leido':
                return 'success';

            case 'No_leido':
                return 'warning';

            default:
                return null;
        }
    };

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;


    const handleRowClick = (notification: Notificacion) => {
        setSelectedNotification(notification);
        setVisible(true);
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        if (_filters['global'] && 'value' in _filters['global']) {
            _filters['global'].value = value;
        }

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    

    const renderHeader = () => {
        return (
            <div className="flex ">
                < PersonSearchIcon className="ms-5 "/>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar por DNI o Nombre" />      
            </div>
        );
    };

    const header = renderHeader();

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
                filters={filters}
                globalFilterFields={['receptor.dni', 'receptor.name', 'receptor.apellido']}
                emptyMessage="No se encontraron notificaciones."
                header={header}
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
                    sortable
                    style={{ width: '15%' }}
                    body={(rowData) => `${rowData.autor.name} ${rowData.autor.apellido}`}
                ></Column>
                <Column
                    field="receptor"
                    header="Receptor"
                    sortable
                    style={{ width: '15%' }}
                    body={(rowData) => `${rowData.receptor.name} ${rowData.receptor.apellido} (DNI:${rowData.receptor.dni})`}
                ></Column>
                <Column
                    field="status"
                    header="Estado"
                    sortable
                    style={{ width: '10%' }}
                    body={(rowData) => <Tag value={rowData.status} severity={getSeverity(rowData.status)} />}
                ></Column>
                <Column
                    field="createdAt"
                    header="Enviado"
                    sortable
                    style={{ width: '20%' }}
                    body={(rowData) => format(new Date(rowData.createdAt), 'eeee d/MM/yyyy', { locale: es })}
                ></Column>
                <Column
                    field="updatedAt"
                    header="Visto"
                    sortable
                    style={{ width: '20%' }}
                    body={(rowData) => rowData.status === 'Leido' ? format(new Date(rowData.updatedAt), 'eeee d/MM/yyyy', { locale: es }) : ''}
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
};

export default NotificadosList;