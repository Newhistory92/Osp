'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect} from 'react';
import { UserProfile } from '@clerk/nextjs';
import { useAppSelector,useAppDispatch } from "../../hooks/StoreHook"
const NavbarVertical = dynamic(() => import('../../components/dashbord/navbars/NavbarVertical'), { ssr: false });
const NavbarTop = dynamic(() => import('../../components/dashbord/navbars/NavbarTop'), { ssr: false });
const Prestadores = dynamic(() => import("../../User2/prestador/TablePrestador"), { ssr: false });
const Profile = dynamic(() => import("../../components/Perfil/Perfil"), { ssr: false });
const FamilyGroup = dynamic(() => import("../../User1/afiliado/FamilyGroupComponent"), { ssr: false });
const Ordenes = dynamic(() => import("../../User1/afiliado/Ordenes/Ordenes"), { ssr: false });
const EditPublicacion = dynamic(() => import('../../User3/operador/Publicacion/EditPublic'), { ssr: false });
const DenunciasTable = dynamic(() => import('../../User3/operador/Publicacion/GestionDenuncia'), { ssr: false });
const Notificador = dynamic(() => import('../../User3/operador/Notificador/Notificador'), { ssr: false });
const Loading = dynamic(() => import('@/app/components/Loading/loading'), { ssr: false });

import { setLoading } from '@/app/redux/Slice/loading';


const DefaultDashboardLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const {
    profileOpen,
    settingOpen,
    familyGroupOpen,
    ordenes,
    publicacionedit,
    denunciaOpen,
    notificadorOpen,
    prestadoresOpen,
    internadosOpen,
    autorizacionesOpen,
    odontologicoOpen,
    bioquimicosOpen,
    facturacionOpen,
    dialisisOpen,
  } = useAppSelector(state => state.navbarvertical);
  const { loading} = useAppSelector((state) => state.loading);
//console.log("login en el dasbha" , loading)
  const currentUser = useAppSelector(state => state.user.currentUser);
  let userRole;

  if (Array.isArray(currentUser)) {
    userRole = currentUser.length > 0 ? currentUser[0].role : null;
  } else {
    userRole = currentUser ? currentUser.role : null;
  }
  
  useEffect(() => {
    const checkUserRole = async () => {
      dispatch(setLoading(true));
      try {
        if (!userRole || !['USER', 'ADMIN', 'PROVIDER', 'EMPLOYEE'].includes(userRole)) {
          window.location.href = '/page/dashboard/not-found';
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkUserRole();
  }, [userRole, dispatch]);


  const ToggleMenu = () => {
    setShowMenu(!showMenu);
  };
  

  useEffect(() => {
    if (internadosOpen) setIframeUrl('https://dossanjuan.online/Osp/Login.Aspx?ReturnUrl=%2fOsp');
    else if (autorizacionesOpen) setIframeUrl('https://dossanjuan.online/OspAmb/Login.Aspx?ReturnUrl=%2fOspAmb%2fdefault.aspx');
    else if (odontologicoOpen) setIframeUrl('https://dossanjuan.online/OspOdontologos/Login.Aspx?ReturnUrl=%2fospodontologos%2fdefault.aspx');
    else if (bioquimicosOpen) setIframeUrl('https://dossanjuan.online/OspBio/Login.Aspx?ReturnUrl=%2fOspBio%2fdefault.aspx');
    else if (facturacionOpen) setIframeUrl('https://dossanjuan.online/OspFacturar/Account/Login.aspx?ReturnUrl=%2fOspFacturar');
    else if (dialisisOpen) setIframeUrl('https://dossanjuan.online/AmbulatorioOsp/Login.Aspx?ReturnUrl=%2fAmbulatorioOsp');
  }, [internadosOpen, autorizacionesOpen, odontologicoOpen, bioquimicosOpen, facturacionOpen, dialisisOpen]);



  return (
    <div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
       {loading && <Loading />}
      <div className="navbar-vertical navbar ">
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
          {settingOpen && <UserProfile routing="hash" />}
          {familyGroupOpen && <FamilyGroup />}
          {ordenes && <Ordenes />}
          {publicacionedit && <EditPublicacion />}
          {denunciaOpen && <DenunciasTable />}
          {notificadorOpen && <Notificador />}
          {prestadoresOpen && <Prestadores />}
        </div>
        {iframeUrl && (
          <iframe src={iframeUrl} style={{ width: '100%', height: '100vh', border: 'none' }} />
        )}
      </div>
    </div>
  );
};

export default DefaultDashboardLayout;
