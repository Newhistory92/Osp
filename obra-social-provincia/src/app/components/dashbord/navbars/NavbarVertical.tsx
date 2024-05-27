import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Logo from "../../../../../public/Logo.png";
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import EditNotificationsRoundedIcon from '@mui/icons-material/EditNotificationsRounded';
import { useAppSelector } from "../../../hooks/StoreHook";
import { PropsNavbarVertical } from '@/app/interfaces/interfaces';
//import "../../../styles/theme.scss"

const NavbarVertical: React.FC<PropsNavbarVertical> = ({ onProfileClick, onSettingClick, onFamilyGroupClick, onOrdenesClick ,onPublicacionClick, onDenunciaClick, onNotificadorClick,onAuditorClick}) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [familyGroupOpen, setFamilyGroupOpen] = useState(false);
  const [ordenes, setOrdenes] = useState(false);
  const [publicacionOpen, setPublicacionOpen] = useState(false);
  const [denunciaOpen, setDenunciaOpen] = useState(false); 
  const [notificadorOpen, setNotificadorOpen] = useState(false);
  const [auditorOpen, setauditorOpen] = useState(false);
  const currentUser = useAppSelector(state => state.user.currentUser);
  let userRole;

  if (Array.isArray(currentUser)) {
    userRole = currentUser.length > 0 ? currentUser[0].role : null;
  } else {
    userRole = currentUser ? currentUser.role : null;
  }

  const handleClick = () => {
    setOpen(!open);
  };

  const handleProfileClick = () => {
    if (profileOpen) {
      setProfileOpen(false);
    } else {
      onProfileClick();
    }
    setOpen(false);
  };

  const handleSettingClick = () => {
    if (profileOpen) {
      setProfileOpen(false);
      onSettingClick();
    } else {
      onSettingClick();
    }
    setOpen(false);
  };

  const handleFamilyGroupClick = () => {
    if (familyGroupOpen) {
      setFamilyGroupOpen(false);
    } else {
      onFamilyGroupClick();
    }
    setOpen(false);
  };

  const handleOrdenesClick = () => {
    if (ordenes) {
      setOrdenes(false); 
    } else {
      onOrdenesClick();
    }
    setOpen(false);
  };

  const handlePublicacionClick = () => {
    setPublicacionOpen(!publicacionOpen);
    setOpen(false);
  };

  const handlePublicacion = () => {
    setPublicacionOpen(!publicacionOpen);
    setOpen(false);
    onPublicacionClick(); 
  };

  const handleDenunciaClick = () => {
    setDenunciaOpen(!denunciaOpen);
    setOpen(false);
    onDenunciaClick(); 
  };
  const handleNotificadorClick = () => {
    setNotificadorOpen(!notificadorOpen); 
    setOpen(false);
    onNotificadorClick()
  };

const handleAudidorClick =() =>{
  setauditorOpen(!auditorOpen);
  setOpen(false);
  onAuditorClick()
}





  return (
    <div className='navbar-vertical'>
      <List style={{ maxHeight: "100vh", width: '100%', maxWidth: 360 }} component="nav">
        <div className="nav-scroller ml-5 navbar-brand">
          <Image src={Logo} alt="" width={90} height={60} />
        </div>
        <div className="navbar-heading nav-item">
          {user ? `Bienvenido ${user.fullName}` : ""}
        </div>
        <div className="slimScrollDiv">
          <div className="navbar-heading navbar navbar-brand">
            MENU
          </div>
          
          <ListItemButton className="nav-item  navbar" onClick={handleClick}>
            <DynamicFeedOutlinedIcon className='ms-3'/>
            <ListItemText className="nav-link ms-1" primary="Datos Personales" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton onClick={handleProfileClick} sx={{ pl: 4 }}>
                <AccountCircleIcon/>
                <ListItemText className="nav-link" primary="Perfil" />
              </ListItemButton>
              <ListItemButton onClick={handleSettingClick} sx={{ pl: 4 }}>
                <SettingsIcon/>
                <ListItemText className="nav-link" primary="Configuración" />
              </ListItemButton>
              {userRole === 'USER' && (
                <ListItemButton onClick={handleFamilyGroupClick} sx={{ pl: 4 }}>
                  <Diversity3Icon/>
                  <ListItemText className="nav-link" primary="Grupo Familiar" />
                </ListItemButton>
              )}
            </List>
          </Collapse>
          
          {/* Botón de Ordenes fuera de Datos Personales */}
          {userRole === 'USER' && (
            <ListItemButton onClick={handleOrdenesClick} sx={{ pl: 4 }}>
              <ContentPasteGoIcon/>
              <ListItemText className="nav-link ms-1" primary="Ordenes" />
            </ListItemButton>
          )}
  {/* Botón de Publicación */}
  {userRole === 'EMPLOYEE' && (
            <ListItemButton className="nav-item  navbar" onClick={handlePublicacionClick}>
              <PostAddOutlinedIcon className='ms-3'/>
              <ListItemText className="nav-link ms-1" primary="Publicación" />
              {publicacionOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          )}
          <Collapse in={publicacionOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton  onClick={handlePublicacion} sx={{ pl: 4 }}>
                <EditNoteOutlinedIcon />
                <ListItemText className="nav-link" primary="Editar Publicación" />
              </ListItemButton>
              {/* <ListItemButton sx={{ pl: 4 }}>
                <ShareOutlinedIcon/>
                <ListItemText className="nav-link" primary="Redes Sociales" />
              </ListItemButton> */}
              <ListItemButton onClick={handleDenunciaClick} sx={{ pl: 4 }}>
                <GavelOutlinedIcon/>
                <ListItemText className="nav-link" primary="Gestión de Denuncias" />
              </ListItemButton>
            </List>
          </Collapse>
              {userRole === 'EMPLOYEE' && (
          <ListItemButton onClick={handleNotificadorClick} sx={{ pl: 4 }}>
            <EditNotificationsRoundedIcon/>
            <ListItemText className="nav-link ms-1" primary="Notificador" />
            
          </ListItemButton>
        )}
          
          {userRole === 'PROVIDER' && (
          <ListItemButton onClick={handleAudidorClick} sx={{ pl: 4 }}>
            <DnsRoundedIcon/>
            <ListItemText className="nav-link ms-1" primary="Sistema Online" />
            {auditorOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        )}
        
        </div>
      </List>
    </div>
  );
}

export default NavbarVertical;

