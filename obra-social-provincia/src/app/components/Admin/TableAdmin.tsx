import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable, DataTableRowEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

import { Afiliado, Prestador, Operador } from '@/app/interfaces/interfaces';

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


const updateUserRole = async (userId: string, updatedUserData: Partial<UserType>): Promise<void> => {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
            throw new Error('Failed to update user data');
        }
    } catch (error) {
        console.error('Error updating user data:', error);
    }
};



const UserTable: React.FC<UserTableProps> = ({ userType }) => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [newRole, setNewRole] = useState<string | null>(null);
    const [newTipo, setNewTipo] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData(userType).then(data => setUsers(data));
    }, [userType]);

    const handleRowClick = (event: DataTableRowEvent) => {
        setSelectedUser(event.data);
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
        if (selectedUser && newRole) {
            const updatedUserData: Partial<UserType> = { role: newRole };
            if (userType === 'prestador' && newTipo) {
                updatedUserData.tipo = newTipo;
            }
            await updateUserRole(selectedUser.id, updatedUserData);
            hideDialog();
            fetchUserData(userType).then(data => setUsers(data)); // Refresh data
        }
    };


    const userDialogFooter = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirm} />
            <Button label="Close" icon="pi pi-times" onClick={hideDialog} />
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

    return (
        <>
            <DataTable value={users} paginator rows={10} removableSort
                       onRowClick={handleRowClick} tableStyle={{ minWidth: '50rem' }} className="p-datatable-hoverable-rows">
                <Column field="name" header="Name" sortable />
                <Column field="apellido" header="Apellido" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="phone" header="Phone" sortable />
                <Column field="role" header="Role" sortable />
                {userType === 'prestador' && <Column field="tipo" header="Tipo" sortable />}
                {userType === 'prestador' && <Column field="denuncias" header="Denuncias" sortable />}
                <Column field="createdAt" header="Created At" sortable />
                <Column field="updatedAt" header="Updated At" sortable />
            </DataTable>

            <Dialog header="User Details" visible={dialogVisible} style={{ width: '50vw' }}
                    footer={userDialogFooter} onHide={hideDialog}>
                {selectedUser && (
                    <div className="p-grid">
                        <div className="p-col-4"><strong>Name:</strong></div>
                        <div className="p-col-8">{selectedUser.name}</div>
                        <div className="p-col-4"><strong>Apellido:</strong></div>
                        <div className="p-col-8">{selectedUser.apellido}</div>
                        <div className="p-col-4"><strong>Email:</strong></div>
                        <div className="p-col-8">{selectedUser.email}</div>
                        <div className="p-col-4"><strong>Phone:</strong></div>
                        <div className="p-col-8">{selectedUser.phone}</div>
                        <div className="p-col-4"><strong>Role:</strong></div>
                        <div className="p-col-8">
                            <ListBox value={newRole} options={roles} optionLabel="name" onChange={handleRoleChange} className="w-full md:w-14rem" />
                        </div>
                        {userType === 'prestador' && (
                            <>
                                <div className="p-col-4"><strong>Tipo:</strong></div>
                                <div className="p-col-8">
                                    <SelectButton value={newTipo} options={tipos} onChange={handleTipoChange} />
                                </div>
                                <div className="p-col-4"><strong>Denuncias:</strong></div>
                                <div className="p-col-8">
                                    {selectedUser.denuncias && selectedUser.denuncias.length > 0 ? selectedUser.denuncias.length : 'Sin Denuncias'}
                                </div>
                            </>
                        )}
                        <div className="p-col-4"><strong>Created At:</strong></div>
                        <div className="p-col-8">{selectedUser.createdAt}</div>
                        <div className="p-col-4"><strong>Updated At:</strong></div>
                        <div className="p-col-8">{selectedUser.updatedAt}</div>
                    </div>
                )}
            </Dialog>
        </>
    );
};

const Dashboard: React.FC = () => {
    return (
        <div className="card">
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