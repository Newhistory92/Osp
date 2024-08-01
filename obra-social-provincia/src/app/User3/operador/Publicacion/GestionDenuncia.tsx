import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable} from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions} from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Denuncia } from '@/app/interfaces/interfaces';
import { useAppSelector } from "../../../hooks/StoreHook"
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';



export default function DenunciasTable() {
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
    const denunciaOpen = useAppSelector(state => state.navbarvertical.denunciaOpen);
    const [filters, setFilters] = useState<any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombrePrestador: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    const capitalizeWords = (str: string) => {
        return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    };

    const getSeverity = (status: string) => {
        switch (status) {
            case 'Leido':
                return 'success';
            case 'Nuevo':
                return 'info';
            default:
                return null;
        }
    };

    useEffect(() => {
        if (denunciaOpen) {
            const fetchDenuncias = async () => {
                try {
                    const response = await fetch('/api/Denuncias');
                    const data = await response.json();
                    if (response.ok) {
                        setDenuncias(data.data);
                    } else {
                        console.error('Error fetching denuncias:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching denuncias:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchDenuncias();
        }
    }, [denunciaOpen]);

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
            <Dropdown value={options.value} options={['Leido', 'Nuevo']} onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Selecciona uno" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };

    const dateBodyTemplate = (rowData: Denuncia) => {
        return <span>{format(new Date(rowData.createdAt), 'eeee d/MM/yyyy', { locale: es })}</span>;
    };
    const handleDenunciaClick = async (denuncia: Denuncia) => {
        setSelectedDenuncia(denuncia);
        setVisible(true);
    
        try {

            const response = await fetch(`/api/Denuncias?id=${denuncia.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Leido' })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
    
            const updatedDenuncias = denuncias.map(d =>
                d.id === denuncia.id ? { ...d, status: 'Leido' } : d
            );
            setDenuncias(updatedDenuncias);
        } catch (error) {
            console.error('Error updating denuncia status:', error);
        }
    };

    const handleCloseModal = () => {
        setVisible(false);
        setSelectedDenuncia(null);
    };

    const headerElement = selectedDenuncia ? (
        <div>
            <div><strong>Prestador:</strong> {capitalizeWords(selectedDenuncia.nombrePrestador)}</div>
            <div><strong>Especialidad:</strong> {capitalizeWords(selectedDenuncia.especialidad)}</div>
            <div><strong>Matricula del Prestador:</strong> {selectedDenuncia.prestadorId}</div>
            <div><strong>Práctica:</strong> {capitalizeWords(selectedDenuncia.practica)}</div>
            <div><strong>Fecha del Suceso:</strong> {format(new Date(selectedDenuncia.fechadelsuceso), 'eeee d/MM/yyyy', { locale: es })}</div>
        </div>
    ) : null;

    const footerContent = (
        <div>
            <Button label="Cerrar" icon="pi pi-times" onClick={handleCloseModal} autoFocus className='mr-5'/>
            <Button label="Imprimir" icon="pi pi-print" onClick={() => window.print()} />
        </div>
    );

    return (
        <div>
            <DataTable value={denuncias} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                globalFilterFields={['nombrePrestador', 'status']} header={renderHeader()} emptyMessage="No se encontraron denuncias."
                selectionMode="single" selection={selectedDenuncia} onSelectionChange={(e) => setSelectedDenuncia(e.value as Denuncia)}>

                <Column field="nombrePrestador" header="Prestador" filter filterPlaceholder="Buscar por prestador" style={{ minWidth: '12rem' }} body={(rowData: Denuncia) => capitalizeWords(rowData.nombrePrestador)} />
                <Column header="Denuncia" style={{ minWidth: '14rem' }} body={(rowData: Denuncia) => (
                    <div className="card flex justify-content-center">
                        <Button label="Ver Motivo" icon="pi pi-external-link" onClick={() => handleDenunciaClick(rowData)} />
                    </div>
                )} />
                <Column field="status" header="Estado" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                <Column field="createdAt" header="Fecha" style={{ minWidth: '12rem' }} body={dateBodyTemplate} sortable />
            </DataTable>
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '50rem' }} onHide={handleCloseModal}>
                <p className="m-0">{selectedDenuncia && selectedDenuncia.motivo}</p>
            </Dialog>
        </div>
    );
}
