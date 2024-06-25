"use client"

import Image from 'next/image';
import Logo from "../../../../public/Logo.png";
import {  useAuth} from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';
import "./navbar.css"
import {useAppDispatch,useAppSelector} from "../../hooks/StoreHook"
import {setSelectedContent,setPublicaciones,setShowPrestadores} from '../../redux/Slice/navbarSlice'
const DynamicButtonUser  = dynamic(() => import('../UserComponent/ButtomUser'));
import { Publicacion } from '@/app/interfaces/interfaces';
import dynamic from 'next/dynamic';

// million-ignore
const Navbar: React.FC =() => {
  const showPrestadores = useAppSelector(state => state.navbar.showPrestadores);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn } =  useAuth();
  const publicaciones = useAppSelector(state => state.navbar.publicaciones);
  const selectedContent = useAppSelector(state => state.navbar.selectedContent);
  const dispatch = useAppDispatch(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
       
  


  const handleDropdownEnter = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const dropdownMenu = event.currentTarget.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.add('show');
    }
  };
  

  const handleDropdownLeave = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const dropdownMenu = event.currentTarget.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.remove('show');
    }
  };
 


  useEffect(() => {
    const getPublicaciones = async () => {
      try {
        const response = await fetch('/api/Publicaciones', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las publicaciones: ' + response.statusText);
        }
        const data = await response.json();

        if (data.status === 200) {
          dispatch(setPublicaciones(data.publicaciones));
        } else {
          console.error('Error: La respuesta del servidor no es válida.');
        }
      } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
      }
    };

    getPublicaciones();
  }, [dispatch]);



  const handleTitleClick = (contenido: string) => {
    if (selectedContent !== contenido) {
      dispatch(setSelectedContent(contenido));
    } else {
      dispatch(setSelectedContent(null));
    }
  };
  const handlePrestadoresClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // Evita que se realice la acción predeterminada del evento (por ejemplo, seguir un enlace)
    event.preventDefault();
    // Verifica si se hizo clic en el botón "Cartilla de Prestadores"
    console.log('Button clicked:', event.currentTarget.id);
    if (event.currentTarget.id === 'cartillaPrestadores') {
      // Si el botón clickeado es el mismo y el estado actual es true, establece el estado en false para cerrar la vista
      dispatch(setShowPrestadores(!showPrestadores));
    } else {
      // Si se hace clic en otro botón del navbar, establece el estado en false
      dispatch(setShowPrestadores(false));
    }
  };
  


   const renderAuthButtons = () => {
    if (isSignedIn) {
      return (
        <div className="flex justify-end mr-10 ">
        
        <DynamicButtonUser />
      </div>
        
      );
      
    } else {
      return (
        <>
         
          <div className="container_button">
            <a href="page/sign-in" className="btn">
              <svg viewBox="0 0 277 62"> 
                <defs>
                  <linearGradient id="grad1">
                  <stop offset="0%" stopColor="#ca5633"/>
                  <stop offset="50%" stopColor="#E53F30" />
                    <stop offset="100%" stopColor="#c0ca33" />
                  </linearGradient>
                </defs>
                <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad1)" width="266" height="50"></rect>
              </svg>
              <span>Iniciar Sesion</span>
            </a>
          </div>
          
          
          <div className="container_button">
            <a href="page/sign-up" className="btn">
              <svg viewBox="0 0 277 62"> 
                <defs>
                  <linearGradient id="grad1">
                  <stop offset="0%" stopColor="#ca5633"/>
                  <stop offset="50%" stopColor="#E53F30" />
                    <stop offset="100%" stopColor="#c0ca33" />
                  </linearGradient>
                </defs>
                <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad1)" width="266" height="50"></rect>
              </svg>
              <span>Registrarse</span>
            </a>
          </div>
        </>
      );
    }
  };
  





  return (
    <header className={`header ${isScrolled ? 'fixed-top' : ''}`}>
     <div className="logo-container animate-slide-in-left animate-duration-1000">
  <div className="text-container">
    <h2>San Juan</h2>
    <h3>Gobierno</h3>
  </div>
  <Image src={Logo} alt="Obra Social Provincia" priority />
</div>
       <a className="logo animate-fade-in-down animate-duration-1000" href="/">Obra Social Provincia</a>
      <input className="menu-btn" type="checkbox" id="menu-btn" />
      <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>
      <div className=''> 
      {renderAuthButtons()}
     </div>
      <ul className="menu">
      <li><a id="cartillaPrestadores" href="#one" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" onClick={handlePrestadoresClick}>Cartilla de Prestadores</a>
</li>
          <li  className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
            <a href="#two" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" data-toggle="dropdown">Afiliaciones</a>
            {publicaciones.map((publicacion:Publicacion, id: number) => (
                 publicacion.published === "afiliaciones" && (
            <div className="dropdown-menu" key={id}>
              <a href="#" className="dropdown-item" onClick={() => handleTitleClick(publicacion.contenido)}>
                {publicacion.titulo}
              </a>
            </div>
        )
      ))}
      </li>
        <li className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
        
          <a href="#two" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" data-toggle="dropdown">Farmacia</a>
          {publicaciones.map((publicacion: Publicacion, id: number) => (
                 publicacion.published === "farmacia" && (
            <div className="dropdown-menu" key={id}>
              <a href="#" className="dropdown-item" onClick={() => handleTitleClick(publicacion.contenido)}>
                {publicacion.titulo}
              </a>
            </div>
        )
      ))}
        </li>
        <li className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
          <a href="#two" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" data-toggle="dropdown">Prestadores</a>
          {publicaciones.map((publicacion: Publicacion, id: number) => (
                 publicacion.published === "prestadores" && (
            <div className="dropdown-menu" key={id}>
              <a href="#" className="dropdown-item" onClick={() => handleTitleClick(publicacion.contenido)}>
                {publicacion.titulo}
              </a>
            </div>
        )
      ))}
        </li>
        <li className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
          <a href="#two" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" data-toggle="dropdown">Servicios</a>
           {publicaciones.map((publicacion: Publicacion, id: number) => (
                  publicacion.published === "servicios" && (
            <div className="dropdown-menu" key={id}>
              <a href="#" className="dropdown-item" onClick={() => handleTitleClick(publicacion.contenido)}>
                {publicacion.titulo}
              </a>
            </div>
        )
      ))}
        </li>
      </ul>
    </header>
  );
};


export default Navbar;