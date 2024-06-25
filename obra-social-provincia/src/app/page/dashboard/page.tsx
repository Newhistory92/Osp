'use client';
import React, { useState, useEffect} from 'react';
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

const DefaultDashboardLayout: React.FC = () => {
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const {
    profileOpen,
    settingOpen,
    familyGroupOpen,
    ordenes,
    publicacionedit,
    denunciaOpen,
    notificadorOpen,
    prestadoresOpen
  } = useAppSelector(state => state.navbarvertical);
 
  const currentUser = useAppSelector(state => state.user.currentUser);
  let userRole;

  if (Array.isArray(currentUser)) {
    userRole = currentUser.length > 0 ? currentUser[0].role : null;
  } else {
    userRole = currentUser ? currentUser.role : null;
  }
  

  useEffect(() => {
    if (!userRole || !['USER', 'ADMIN', 'PROVIDER', 'EMPLOYEE'].includes(userRole)) {
      window.location.href = '/page/dashboard/not-found';
    }
  }, [userRole]);



  const ToggleMenu = () => {
    setShowMenu(!showMenu);
  };
  



  return (
    <div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
      <div className="navbar-vertical navbar">
        <NavbarVertical/>
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
        <div className='px-6 border-top py-3'>
          {profileOpen && <Profile />}
          {settingOpen && <UserProfile />}
          {familyGroupOpen && <FamilyGroup />}
          {ordenes && <Ordenes />}
          {publicacionedit && <EditPublicacion />}
          {denunciaOpen && <DenunciasTable />}
          {notificadorOpen && <Notificador />}
          {prestadoresOpen && <Prestadores />}
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboardLayout;
