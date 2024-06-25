import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import dataDenuncias from "../../../../../denuncias.json";
import { Avatar } from 'primereact/avatar';
import { Denuncia } from '@/app/interfaces/interfaces';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

export default function DenunciasTable() {
    const [customers, setCustomers] = useState<Denuncia[]>([]);
    const [filters, setFilters] = useState<{
        global: { value: string | null, matchMode: FilterMatchMode },
        autor: { value: string | null, matchMode: FilterMatchMode },
        prestador: { value: string | null, matchMode: FilterMatchMode },
        status: { value: string | null, matchMode: FilterMatchMode }
    }>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        autor: { value: null, matchMode: FilterMatchMode.CONTAINS },
        prestador: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [statuses] = useState<string[]>(['No solucionado', 'Leido', 'Nuevo', 'Pendiente', 'Otros']);
    const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const getSeverity = (status: string) => {
        switch (status) {
            case 'No solucionado':
                return 'danger';

            case 'Leido':
                return 'success';

            case 'Nuevo':
                return 'info';

            case 'Pendiente':
                return 'warning';

            case 'Otros':
                return null;

            default:
                return null;
        }
    };

    useEffect(() => {
        setCustomers(dataDenuncias);
        setLoading(false);
        console.log("selectedDenuncia:", selectedDenuncia);
    }, [selectedDenuncia]);
    

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busqueda" />
                </span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Denuncia) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };
    const statusItemTemplate = (option: string) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };
    const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <Dropdown value={options.value} options={statuses} onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };
    const verifiedBodyTemplate = (rowData: Denuncia) => {
        return <span>{rowData.createdAt}</span>;
    };


   
    const handleDenunciaClick = (denuncia: Denuncia) => {
        setSelectedDenuncia(denuncia);
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
        setSelectedDenuncia(null); // Reset selectedDenuncia when closing modal
    };

    
     const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
            <span className="font-bold white-space-nowrap">{selectedDenuncia && selectedDenuncia.autor}</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cerrar" icon="pi pi-times" onClick={() => setVisible(false)} autoFocus />
        </div>
    );
    
    

    return (
        <div className="">
           <DataTable value={customers} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
    globalFilterFields={['autor', 'prestador', 'status']} header={renderHeader()} emptyMessage="No Econtro Denuncias."
    selectionMode="single" selection={selectedDenuncia}  onSelectionChange={(e) => setSelectedDenuncia(e.value as Denuncia)}>

                <Column field="autor" header="Autor" filter filterPlaceholder="Buscar por autor" style={{ minWidth: '12rem' }} />
                <Column field="prestador" header="Prestador" filter filterPlaceholder="Buscar por prestador" style={{ minWidth: '12rem' }} />
                <Column header="Denuncia" style={{ minWidth: '14rem' }} body={(rowData: Denuncia) => (
                    <div className="card flex justify-content-center">
                        <Button label="Ver Motivo" icon="pi pi-external-link" onClick={() => handleDenunciaClick(rowData)} />
                    </div>
                )} />
                <Column field="status" header="Estado" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                <Column field="createdAt" header="Fecha" dataType="boolean" style={{ minWidth: '6rem' }} body={verifiedBodyTemplate} />
            </DataTable>
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '50rem' }} onHide={handleCloseModal}>
                <p className="m-0">{selectedDenuncia && selectedDenuncia.motivo}</p>
            </Dialog>
        </div>
    );
}









// useEffect(() => {
//     const getDenuncias = async () => {
//         try {
//             const response = await fetch(`/api/Denuncias`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             const data = await response.json();
//             if (data.status === 200) {
//                 setDenuncias(data.denuncias);
//             } else {
//                 setDenuncias([]);
//                 console.error('Error: La respuesta del servidor está vacía.');
//             }
//         } catch (error) {
//             console.error('Error al obtener las denuncias', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     getDenuncias();
// }, []);
