"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import NavbarVertical from '../../components/dashbord/navbars/NavbarVertical';
import NavbarTop from '../../components/dashbord/navbars/NavbarTop';
import { useAppSelector} from "../../hooks/StoreHook"
const DynamicProfile = dynamic(() => import('../../components/Perfil/Perfil'));
const DynamicUserProfile = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserProfile));
const DynamicFamilyGroup = dynamic(() => import('../../User1/afiliado/FamilyGroupComponent'));
const DynamicOrdenes = dynamic(() => import('../../User1/afiliado/Ordenes/Ordenes'));
const DynamicEditPublicacion = dynamic(() => import('../../User3/operador/Publicacion/EditPublic'));
const DynamicDenunciasTable = dynamic(() => import('../../User3/operador/Publicacion/GestionDenuncia'));
const DynamicNotificador = dynamic(() => import('../../User3/operador/Notificador/Notificador'));
const DynamicPrestadores = dynamic(() => import('../../User2/prestador/TablePrestador'));

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
        {profileOpen && <DynamicProfile />}
      {settingOpen && <DynamicUserProfile />}
      {familyGroupOpen && <DynamicFamilyGroup />}
      {ordenes && <DynamicOrdenes />}
      {publicacionedit && <DynamicEditPublicacion />}
      {denunciaOpen && <DynamicDenunciasTable />}
      {notificadorOpen && <DynamicNotificador />}
      {prestadoresOpen && <DynamicPrestadores />}
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboardLayout;
