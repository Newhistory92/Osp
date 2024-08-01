"use client"
import React, { useState, useEffect} from 'react';
import NavbarVertical from '../../../components/dashbord/navbars/NavbarVertical';
import NavbarTop from '../../../components/dashbord/navbars/NavbarTop';
import { useAppSelector } from "../../../hooks/StoreHook"
import Dashboard from '@/app/components/Admin/TableAdmin';

const DashboardAdmin: React.FC = () => {
    const [showMenu, setShowMenu] = useState<boolean>(true);
 
  const currentUser = useAppSelector(state => state.user.currentUser);
  let userRole;

  if (Array.isArray(currentUser)) {
    userRole = currentUser.length > 0 ? currentUser[0].role : null;
  } else {
    userRole = currentUser ? currentUser.role : null;
  }
  

  useEffect(() => {
    if (!userRole || !['ADMIN', 'EMPLOYEE'].includes(userRole)) {
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
       <Dashboard/>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
