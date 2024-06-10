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
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import EditNotificationsRoundedIcon from '@mui/icons-material/EditNotificationsRounded';
import { useAppSelector,useAppDispatch } from "../../../hooks/StoreHook";
import { NavbarStateVertical } from '@/app/interfaces/interfaces';
import { toggle, closeAll } from '../../../redux/Slice/navbarVerticalSlice';
//import "../../../styles/theme.scss"
const NavbarVertical: React.FC = React.memo(() => {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const {
    open,
    profileOpen,
    settingOpen,
    familyGroupOpen,
    ordenes,
    publicacionOpen,
    publicacionedit,
    denunciaOpen,
    notificadorOpen,
    prestadoresOpen,
    auditorOpen
  } = useAppSelector(state => state.navbarvertical);
  const currentUser = useAppSelector(state => state.user.currentUser);
  
  let userRole;

  if (Array.isArray(currentUser)) {
    userRole = currentUser.length > 0 ? currentUser[0].role : null;
  } else {
    userRole = currentUser ? currentUser.role : null;
  }

  const handleClick = (sectionClick: keyof NavbarStateVertical) => {
    if (sectionClick === 'open' || sectionClick === 'publicacionOpen') {
      dispatch(toggle(sectionClick));
    } else {
      if ((sectionClick === 'profileOpen' && profileOpen) ||
          (sectionClick === 'settingOpen' && settingOpen) ||
          (sectionClick === 'familyGroupOpen' && familyGroupOpen) ||
          (sectionClick === 'ordenes' && ordenes) ||
          (sectionClick === 'publicacionedit' && publicacionedit) ||
          (sectionClick === 'denunciaOpen' && denunciaOpen) ||
          (sectionClick === 'notificadorOpen' && notificadorOpen) ||
          (sectionClick === 'auditorOpen' && auditorOpen) ||
          (sectionClick === 'prestadoresOpen' && prestadoresOpen)) {
        dispatch(toggle(sectionClick));
      } else {
        dispatch(closeAll());
        dispatch(toggle(sectionClick));
      }
    }
  };

  return (
    <div className='navbar-vertical'>
      
      <List style={{ maxHeight: "100vh", width: '100%', maxWidth: 360 }} component="nav">
        <div className="nav-scroller ml-5 navbar-brand">
          <Image src={Logo} alt="" width={90} height={60} priority />
        </div>
        <div className="navbar-heading nav-item">
          {user ? `Bienvenido ${user.fullName}` : ""}
        </div>
        <div className="slimScrollDiv">
          <div className="navbar-heading navbar navbar-brand">
            MENU
          </div>
          <ListItemButton className="nav-item navbar" onClick={() => handleClick('open')}>
            <DynamicFeedOutlinedIcon className='ms-3'/>
            <ListItemText className="nav-link ms-1" primary="Datos Personales" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton onClick={() => handleClick('profileOpen')}>
                <AccountCircleIcon/>
                <ListItemText className="nav-link" primary="Perfil" />
              </ListItemButton>
              <ListItemButton onClick={() => handleClick('settingOpen')}>
                <SettingsIcon/>
                <ListItemText className="nav-link" primary="Configuración" />
              </ListItemButton>
              {userRole === 'USER' && (
                <ListItemButton onClick={() => handleClick('familyGroupOpen')}>
                  <Diversity3Icon/>
                  <ListItemText className="nav-link" primary="Grupo Familiar" />
                </ListItemButton>
              )}
            </List>
          </Collapse>

          {userRole === 'USER' && (
            <><ListItemButton onClick={() => handleClick('ordenes')}>
              <ContentPasteGoIcon />
              <ListItemText className="nav-link ms-1" primary="Ordenes" />
            </ListItemButton>
            <ListItemButton onClick={() => handleClick('prestadoresOpen')}>
                <MedicalInformationIcon />
                <ListItemText className="nav-link ms-1" primary="Cartilla de Prestadores" />
              </ListItemButton></>
          )}

          {userRole === 'EMPLOYEE' && (
            <ListItemButton className="nav-item navbar" onClick={() => handleClick('publicacionOpen')}>
              <PostAddOutlinedIcon className='ms-3'/>
              <ListItemText className="nav-link ms-1" primary="Publicación" />
              {publicacionOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          )}
          <Collapse in={publicacionOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton onClick={() => handleClick('publicacionedit')}>
                <EditNoteOutlinedIcon />
                <ListItemText className="nav-link" primary="Editar Publicación" />
              </ListItemButton>
              <ListItemButton onClick={() => handleClick('denunciaOpen')}>
                <GavelOutlinedIcon/>
                <ListItemText className="nav-link" primary="Gestión de Denuncias" />
              </ListItemButton>
            </List>
          </Collapse>

          {userRole === 'EMPLOYEE' && (
            <ListItemButton onClick={() => handleClick('notificadorOpen')}>
              <EditNotificationsRoundedIcon/>
              <ListItemText className="nav-link ms-1" primary="Notificador" />
            </ListItemButton>
          )}

          {userRole === 'PROVIDER' && (
            <ListItemButton onClick={() => handleClick('auditorOpen')}>
              <DnsRoundedIcon/>
              <ListItemText className="nav-link ms-1" primary="Sistema Online" />
              {auditorOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          )}
        </div>
      </List>
    </div>
  );
});

export default NavbarVertical;