import React, { useState, useEffect,useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable,DataTableFilterMeta, DataTableRowEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { FilterMatchMode } from 'primereact/api';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import Loading from '../Loading/loading';
import { Toast } from 'primereact/toast';
import { Afiliado, Prestador, Operador } from '@/app/interfaces/interfaces';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type UserType = Afiliado | Prestador | Operador;

interface UserTableProps {
    userType: 'afiliado' | 'prestador' | 'operador';
}

const fetchUserData = async (userType: string): Promise<UserType[]> => {
    try {
        const response = await fetch(`/api/Datos/${userType}`);
        const data = await response.json();
        console.log(data)
         return data;
        
    } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }
};





const UserTable: React.FC<UserTableProps> = ({ userType }) => {
    const toast = useRef<Toast>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [newRole, setNewRole] = useState<string | null>(null);
    const [newTipo, setNewTipo] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        apellido: { value: null, matchMode: FilterMatchMode.CONTAINS },
        dni: { value: null, matchMode: FilterMatchMode.CONTAINS },
        matricula: { value: null, matchMode: FilterMatchMode.CONTAINS },
        numeroOperador: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

 
   

   
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchUserData(userType);
            setUsers(data);
            setLoading(false);
        };
        fetchData();
    }, [userType]);

    const handleRowClick = (event: DataTableRowEvent) => {
        const data = event.data as UserType;
        setSelectedUser(data);
        setNewRole(event.data.role);
        if (userType === 'prestador') {
            setNewTipo(event.data.tipo);
        }
        setDialogVisible(true);
    };
    const hideDialog = () => {
        setDialogVisible(false);
    };
    
    const handleRoleChange = (e: ListBoxChangeEvent) => {
        setNewRole(e.value);
    };

    const handleTipoChange = (e: SelectButtonChangeEvent) => {
        setNewTipo(e.value);
    };


    const handleConfirm = async () => {
        if (selectedUser && selectedUser.id && newRole) {
            let updatedUserData: { id: string } & Partial<UserType> = { id: selectedUser.id };
            
            if (userType === 'operador') {
                updatedUserData = { ...updatedUserData, role: newRole };
            } else if (userType === 'prestador' && newTipo) {
                updatedUserData = { ...updatedUserData, tipo: newTipo };
            }
    
            console.log(selectedUser, "la información del usuario");
            console.log(updatedUserData, "datos a mandar a la función");
    
            setLoading(true);
            await updateUserRole(selectedUser.id, updatedUserData, userType);
            hideDialog();
            const data = await fetchUserData(userType);
            setUsers(data);
            setLoading(false);
        } else {
            console.error('Selected user or user ID is undefined.');
        }
    };
    
    const updateUserRole = async (id: string, updatedUserData: Partial<Operador>, userType: string):  Promise<void> => {
  
        try {
           console.log(updatedUserData)
            const response = await fetch(`/api/Datos/${userType}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });
            if (response.ok) {
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'La modificacion ocurrio con Exito ', life: 3000 });
            }
            else if (!response.ok) {
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar la Modificacion', life: 3000 });
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    

    const userDialogFooter = (
        <div>
            <Button label="Confirmar"  className= "mr-2  font-medium text-xl rounded-md bg-green-50 px-2 py-1   text-green-700 ring-1 ring-inset ring-green-600/20" onClick={handleConfirm} />
            <Button label="Cerrar" className='mr-2   font-medium text-xl rounded-md bg-red-50 px-2 py-1   text-red-700 ring-1 ring-inset ring-red-600/10' onClick={hideDialog} />
        </div>
    );

    const roles = [
        { name: 'Administrador', code: 'ADMIN' },
        { name: 'Afiliado', code: 'USER' },
        { name: 'Operador', code: 'EMPLOYEE' },
        { name: 'Prestador', code: 'PROVIDER' },
        { name: 'Prensa', code: 'PRENSA' },
        { name: 'Notificador', code: 'NOTIFICADOR' },
        { name: 'Auditor', code: 'AUDITOR' }
    ];

    const tipos = [
        { label: 'Fidelizado', value: 'FIDELIZADO' },
        { label: 'No Fidelizado', value: 'NO_FIDELIZADO' }
    ];
      
    const clearFilters = () => {
        setFilters({
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            apellido: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dni: { value: null, matchMode: FilterMatchMode.CONTAINS },
            matricula: { value: null, matchMode: FilterMatchMode.CONTAINS },
            numeroOperador: { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end navbar-heading navbar navbar-brand">
                <SearchOffIcon />
                <Button type="button"  label="Clear" outlined onClick={clearFilters} />
            </div>
        );
    };

    const header = renderHeader();

    return (
        <>
          {loading && <Loading />}
          <Toast ref={toast} />
          <DataTable value={users} paginator rows={10} removableSort
                filters={filters} globalFilterFields={['name', 'apellido', 'dni', 'matricula', 'numeroOperador']}
                header={header} emptyMessage="No users found."
                onRowClick={handleRowClick}
                tableStyle={{ minWidth: '50rem' }} className="p-datatable-hoverable-rows">
                <Column field="name" header="Nombre" filter filterPlaceholder="Buscar por nombre" filterMatchMode={FilterMatchMode.CONTAINS} sortable />
                <Column field="apellido" header="Apellido" filter filterPlaceholder="Buscar por apellido" filterMatchMode={FilterMatchMode.CONTAINS} sortable />
                <Column field="email" header="Email" sortable />
                <Column field="phone" header="Telefono" sortable />
                {userType === 'afiliado' && <Column field="dni" header="DNI" filter filterPlaceholder="Buscar por DNI" filterMatchMode={FilterMatchMode.CONTAINS} sortable />}
                {userType === 'afiliado' && <Column field="dependencia" header="Dependencia" sortable />}
                {userType === 'prestador' && <Column field="matricula" header="Matricula" filter filterPlaceholder="Buscar por matrícula" filterMatchMode={FilterMatchMode.CONTAINS} sortable />}
                {userType === 'prestador' && <Column field="tipo" header="Tipo" sortable />}
                {userType === 'prestador' && <Column field="denuncias" header="Denuncias" sortable />}
                {userType === 'operador' && <Column field="numeroOperador" header="Número de Operador" filter filterPlaceholder="Buscar por número de operador" filterMatchMode={FilterMatchMode.CONTAINS} sortable />}
                <Column field="createdAt" body={(rowData) => format(new Date(rowData.createdAt), 'eeee d/MM/yyyy', { locale: es })} header="Alta" sortable />
                <Column field="updatedAt" body={(rowData) => format(new Date(rowData.createdAt), 'eeee d/MM/yyyy', { locale: es })} header="Ultima Modificación" sortable />
            </DataTable>


            <Dialog header="Detalles del Usuario" visible={dialogVisible} style={{ width: '50vw' }}
                    footer={userDialogFooter} onHide={hideDialog}>
                {selectedUser && (
                    <div className="p-grid">
                        <div className="p-col-4"><strong>Nombre:</strong></div>
                        <div className="p-col-8">{selectedUser.name}</div>
                        <div className="p-col-4"><strong>Email:</strong></div>
                        <div className="p-col-8">{selectedUser.email}</div>
                        <div className="p-col-4"><strong>Telefono:</strong></div>
                        <div className="p-col-8">{selectedUser.phone}</div>
                        {userType === 'afiliado' && (
                            <>
                                <div className="p-col-4"><strong>DNI:</strong></div>
                                <div className="p-col-8">{(selectedUser as Afiliado).dni}</div>
                                <div className="p-col-4"><strong>Dependencia:</strong></div>
                                <div className="p-col-8">{(selectedUser as Afiliado).dependencia}</div>
                            </>
                        )}
                        {userType === 'prestador' && (
                            <>
                                 <div className="p-col-4"><strong>Matricula:</strong></div>
                                <div className="p-col-8">{(selectedUser as Prestador).matricula}</div>
                                <div className="p-col-4"><strong>Especialidad:</strong></div>
                                <div className="p-col-8">{(selectedUser as Prestador).especialidad}</div>
                                <div className="p-col-4"><strong>Especialidad2:</strong></div>
                                <div className="p-col-8">{(selectedUser as Prestador).especialidad2}</div>
                                <div className="p-col-4"><strong>Especialidad3:</strong></div>
                                <div className="p-col-8">{(selectedUser as Prestador).especialidad3}</div>
                                <div className="p-col-4"><strong>Tipo:</strong></div>
                                <div className="p-col-8">
                                    <SelectButton value={newTipo} options={tipos} onChange={handleTipoChange} />
                                </div>
                                <div className="p-col-4"><strong>Denuncias:</strong></div>
                                <div className="p-col-8">
                                    {(selectedUser as Prestador).denuncias && (selectedUser as Prestador).denuncias.length > 0 ? (selectedUser as Prestador).denuncias.length : 'Sin Denuncias '}
                                </div>

                            </>
                        )}
                        {userType === 'operador' && (
                            <>
                                <div className="p-col-4"><strong>Número de Operador:</strong></div>
                                <div className="p-col-8">{(selectedUser as Operador).numeroOperador}</div>
                            </>
                        )}
                        {userType === 'operador' && (
                            <>
                                <div className="p-col-4"><strong>Rol:</strong></div>
                                <div className="p-col-8">
                                    <ListBox value={newRole} options={roles} optionLabel="name" onChange={handleRoleChange} className="w-full md:w-14rem" />
                                </div>
                            </>
                        )}
                        <div className="p-col-4"><strong>Alta:</strong></div>
                        <div className="p-col-8">{selectedUser.createdAt}</div>
                        <div className="p-col-4"><strong>Ultima Modificación:</strong></div>
                        <div className="p-col-8">{selectedUser.updatedAt}</div>
                    </div>
                )}
            </Dialog>
        </>
    );
};

const Dashboard: React.FC = () => {
    return (
        <div className="card ">
            <TabView>
                <TabPanel header="Afiliado">
                    <UserTable userType="afiliado" />
                </TabPanel>
                <TabPanel header="Prestador">
                    <UserTable userType="prestador" />
                </TabPanel>
                <TabPanel header="Operador">
                    <UserTable userType="operador" />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default Dashboard;