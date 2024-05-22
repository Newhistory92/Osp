"use client"
import React, { useState } from 'react';
import NavbarVertical from '../../components/dashbord/navbars/NavbarVertical';
import NavbarTop from '../../components/dashbord/navbars/NavbarTop';
import Prestadores from "../../User2/prestador/TablePrestador";
import Profile from "../../components/Perfil/Perfil";
import { useAppSelector } from "../../hooks/StoreHook"
import { UserProfile } from '@clerk/nextjs';
import FamilyGroup from "../../User1/afiliado/FamilyGroupComponent"
import Ordenes from "../../User1/afiliado/Ordenes/Ordenes"
import EditPublicacion from '../../User3/operador/Publicacion/EditPublic';
import DenunciasTable from '../../User3/operador/Publicacion/GestionDenuncia';
import Notificador from '../../User3/operador/Notificador/Notificador';

interface Props {
  children: React.ReactNode;
}

const DefaultDashboardLayout: React.FC<Props> = ({ children }) => {
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [profileActive, setProfileActive] = useState(false);
  const [settingActive, setSettingActive] = useState(false);
  const [familyGroupActive, setFamilyGroupActive] = useState(false);
  const [ordenesActive, setOrdenesActive] = useState(false); // Nuevo estado para Ordenes
  const [publicacionActive, setPublicacionActive] = useState(false); // Nuevo estado para Publicación
  const [denunciaActive, setDenunciaActive] = useState(false); // Nuevo estado para Gestión de Denuncias
  const [notificadorActive, setNotificadorActive] = useState(false); 
  const [auditorActive, setauditorActive] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);
  let userRole;

  if (Array.isArray(currentUser)) {
    userRole = currentUser.length > 0 ? currentUser[0].role : null;
  } else {
    userRole = currentUser ? currentUser.role : null;
  }
  
  const ToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleProfileClick = () => {
    setProfileActive(!profileActive);
    if (settingActive) {
      setSettingActive(false);
    }
  };

  const handleSettingClick = () => {
    setSettingActive(!settingActive);
    if (profileActive) {
      setProfileActive(false);
    }
  };

  const handleFamilyGroupClick = () => {
    setFamilyGroupActive(!familyGroupActive);
    if (profileActive || settingActive) {
      setProfileActive(false);
      setSettingActive(false);
    }
  };

  const handleOrdenesClick = () => {
    setOrdenesActive(!ordenesActive); // Alternar el estado de Ordenes
    if (profileActive || settingActive || familyGroupActive) {
      setProfileActive(false);
      setSettingActive(false);
      setFamilyGroupActive(false);
    }
  };

  const handlePublicacion = () => {
    setPublicacionActive(!publicacionActive); // Alternar el estado de Publicación
    if (profileActive || settingActive || familyGroupActive || ordenesActive) {
      setProfileActive(false);
      setSettingActive(false);
      setFamilyGroupActive(false);
      setOrdenesActive(false);
    }
  };

  const handleDenuncia = () => {
    setDenunciaActive(!denunciaActive); 
    if (profileActive || settingActive || familyGroupActive || ordenesActive || publicacionActive) {
      setProfileActive(false);
      setSettingActive(false);
      setFamilyGroupActive(false);
      setOrdenesActive(false);
      setPublicacionActive(false);
    }
  };

  const handleNotificadorClick = () => {
    setNotificadorActive(!notificadorActive);
    if (profileActive || settingActive || familyGroupActive || ordenesActive || publicacionActive || denunciaActive) {
      setProfileActive(false);
      setSettingActive(false);
      setFamilyGroupActive(false);
      setOrdenesActive(false);
      setPublicacionActive(false);
      setDenunciaActive (false)
    }
  };

  const handleAudidorClick = () => {
    setauditorActive(!auditorActive);
    if (profileActive || settingActive || familyGroupActive || ordenesActive || publicacionActive || denunciaActive  || notificadorActive) {
      setProfileActive(false);
      setSettingActive(false);
      setFamilyGroupActive(false);
      setOrdenesActive(false);
      setPublicacionActive(false);
      setDenunciaActive (false)
      setNotificadorActive(false)
    }
  };


  return (
    <div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
      <div className="navbar-vertical navbar">
        <NavbarVertical
          onSettingClick={handleSettingClick}
          onProfileClick={handleProfileClick} 
          onFamilyGroupClick={handleFamilyGroupClick}
          onOrdenesClick={handleOrdenesClick}
          onPublicacionClick={handlePublicacion} 
          onDenunciaClick={handleDenuncia}
          onNotificadorClick={handleNotificadorClick} 
          onAuditorClick ={handleAudidorClick}
      
        />
      </div>
      <div id="page-content">
        <div className="header">
          <NavbarTop
            data={{
              showMenu: showMenu,
              SidebarToggleMenu: ToggleMenu
            }}
          />
        </div>
        {children}
        <div className='px-6 border-top py-3'>
          {profileActive && <Profile />}
          {settingActive && <UserProfile />} 
          {familyGroupActive && <FamilyGroup />}
          {ordenesActive && <Ordenes />}
          {publicacionActive && <EditPublicacion />}
          {denunciaActive && <DenunciasTable />}
          {notificadorActive && <Notificador />} 
          {(userRole === 'USER') && <Prestadores />}
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboardLayout;
