"use client"

import Image from 'next/image';
import Logo from "../../../../public/Logo.png";
import OSP from "../../../../public/OSP.png";
import {  useAuth} from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';
import "./navbar.css"
import {useAppDispatch,useAppSelector} from "../../hooks/StoreHook"
import {setSelectedContent,setPublicaciones,setShowPrestadores} from '../../redux/Slice/navbarSlice'
const DynamicButtonUser  = dynamic(() => import('../UserComponent/ButtomUser'));
import { Publicacion } from '@/app/interfaces/interfaces';
import dynamic from 'next/dynamic';
import Link from 'next/link';


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

    event.preventDefault();
    if (event.currentTarget.id === 'cartillaPrestadores') {  
      dispatch(setShowPrestadores(!showPrestadores));
    } else {
      dispatch(setShowPrestadores(false));
    }
  };
  

  const renderAuthButtons = () => {
    if (isSignedIn) {
      return (
        <div className="flex justify-end mr-10">
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
                    <stop offset="0%" stopColor="#ca5633" />
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
                    <stop offset="0%" stopColor="#ca5633" />
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
        <Image src={Logo} alt="Gobierno de San Juan" priority />
        <Image className='logoOSP' src={OSP} alt="Obra Social Provincia" priority />
      </div>
      <input className="menu-btn" type="checkbox" id="menu-btn" />
      <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>
      <div className="auth-social-wrapper">
        <div className="social-containernavbar">
          <Link href="https://www.facebook.com/obrasocial.sanjuan.gob?mibextid=ZbWKwL">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
              <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
              <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359
              c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,
              23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
            </svg>
          </Link>
          <Link href="https://www.instagram.com/obrasocialprovincia?igsh=MWRoNHllcG5wdzA4dA==">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
              <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fd5"></stop>
                <stop offset=".328" stopColor="#ff543f"></stop>
                <stop offset=".348" stopColor="#fc5245"></stop>
                <stop offset=".504" stopColor="#e64771"></stop>
                <stop offset=".643" stopColor="#d53e91"></stop>
                <stop offset=".761" stopColor="#cc39a4"></stop>
                <stop offset=".841" stopColor="#c837ab"></stop>
              </radialGradient>
              <path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20
              c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20C42.014,38.383,38.417,41.986,
              34.017,41.99z"></path>
              <radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#4168c9"></stop>
                <stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop>
              </radialGradient>
              <path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20
              c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20C42.014,38.383,38.417,41.986,
              34.017,41.99z"></path>
              <path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5
              s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path>
              <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
              <path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12C37,33.86,33.859,37,
              30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
            </svg>
          </Link>
        </div>
       
          {renderAuthButtons()}
       
      </div>
      <ul className="menu">
        <li><a id="cartillaPrestadores" href="#one" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" onClick={handlePrestadoresClick}>Cartilla de Prestadores</a></li>
        <li className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
          <a href="#two" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" data-toggle="dropdown">Afiliaciones</a>
          <div className="dropdown-menu">
            {publicaciones.map((publicacion: Publicacion, id: number) => (
              publicacion.published === "afiliaciones" && (
                <a href="#" className="dropdown-item" key={id} onClick={() => handleTitleClick(publicacion.contenido)}>
                  {publicacion.titulo}
                </a>
              )
            ))}
          </div>
        </li>
        <li className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
          <a href="#two" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" data-toggle="dropdown">Farmacia</a>
          <div className="dropdown-menu">
            {publicaciones.map((publicacion: Publicacion, id: number) => (
              publicacion.published === "farmacia" && (
                <a href="#" className="dropdown-item" key={id} onClick={() => handleTitleClick(publicacion.contenido)}>
                  {publicacion.titulo}
                </a>
              )
            ))}
          </div>
        </li>
        <li className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
          <a href="#two" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" data-toggle="dropdown">Prestadores</a>
          <div className="dropdown-menu">
            {publicaciones.map((publicacion: Publicacion, id: number) => (
              publicacion.published === "prestadores" && (
                <a href="#" className="dropdown-item" key={id} onClick={() => handleTitleClick(publicacion.contenido)}>
                  {publicacion.titulo}
                </a>
              )
            ))}
          </div>
        </li>
        <li className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
          <a href="#two" className="link link-theme link-arrow animate-zoom-in animate-duration-1000" data-toggle="dropdown">Servicios</a>
          <div className="dropdown-menu">
            {publicaciones.map((publicacion: Publicacion, id: number) => (
              publicacion.published === "servicios" && (
                <a href="#" className="dropdown-item" key={id} onClick={() => handleTitleClick(publicacion.contenido)}>
                  {publicacion.titulo}
                </a>
              )
            ))}
          </div>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;