import React from 'react';
import "./footer.css";
import Image from 'next/image';
import logoNegativo from "../../../../public/logo_negativo.png";
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { orange } from '@mui/material/colors';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
// million-ignore
const Footer = () => {
  return (
    <footer className="footer-section overflow-hidden">
      <div className="container mx-auto px-5">
        <div className="footer-cta pt-5 pb-5 flex flex-wrap">
          <div className="single-cta">
            <h4><ShareLocationOutlinedIcon sx={{ color: orange[400], fontSize: 30 }} /> Encuéntranos</h4>
            <span>Sede Central: Agustin Gnecco 360 (S)- 5400 | San Juan, Argentina</span>
          </div>
          <div className="single-cta">
            <h4><SupportAgentOutlinedIcon sx={{ color: orange[400], fontSize: 30 }} /> Llámanos</h4>
            <span>Teléfonos: (0264) 4304300 | Línea gratuita 0800 999 6666</span>
          </div>
          <div className="single-cta">
            <h4><MarkEmailReadOutlinedIcon sx={{ color: orange[400], fontSize: 30 }} /> Envíanos un correo</h4>
            <span>obrasocialprovincia@info.com</span>
          </div>
        </div>
        <div className="footer-content pt-5 pb-5">
          <div className="flex flex-wrap justify-between">
            <div className="footer-widget">
              <div className="footer-logo">
                <a href="index.html"><Image src={logoNegativo} alt="Obra Social Provincia" width={200} height={80} /></a>
              </div>
              <div className="footer-text">
                <p>La Dirección de Obra Social pretende acompañar a los afiliados en las distintas etapas de la vida, en todo momento, en toda la provincia, y con una marcada orientación de la prevención, posibilitando la máxima accesibilidad a los servicios y garantizando el respeto por la dignidad humana.</p>
              </div>
            </div>
            <div className="footer-widget">
              <div className="footer-widget-heading">
                <h3>Enlaces útiles</h3>
              </div>
              <ul>

              <li><a href="#">Inicio</a></li>
            <li><a href="#">Afiliaciones</a></li>
            <li><a href="#">Servicios</a></li>
             <li><a href="#">Términos de uso </a></li>
            <li><a href="#">Contactanos</a></li>
            <li><a href="#">Preguntas Frecuentes</a></li>
            <li><a href="#">Política de privacidad</a></li>

              </ul>
            </div>
            <div className="footer-widget">
              <div className="footer-widget-heading">
                <h3>Redes sociales</h3>
              </div>
              <div className="footer-social-icon">
                <div className="social-container">
                <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                                <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                                </svg>
                                </a>
                                <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                                <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fd5"></stop><stop offset=".328" stopColor="#ff543f"></stop><stop offset=".348" stopColor="#fc5245"></stop><stop offset=".504" stopColor="#e64771"></stop><stop offset=".643" stopColor="#d53e91"></stop><stop offset=".761" stopColor="#cc39a4"></stop><stop offset=".841" stopColor="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0"stopColor="#4168c9"></stop><stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
                                </svg> 
                                </a>
                               <a href="#">
                               <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                               <polygon fill="#616161" points="41,6 9.929,42 6.215,42 37.287,6"></polygon><polygon fill="#fff" fillRule="evenodd" points="31.143,41 7.82,7 16.777,7 40.1,41" clipRule="evenodd"></polygon><path fill="#616161" d="M15.724,9l20.578,30h-4.106L11.618,9H15.724 M17.304,6H5.922l24.694,36h11.382L17.304,6L17.304,6z"></path>
                                </svg>
                               </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom text-center pt-2">
        <div className="copyright-text">
          <p>&copy; 2024 Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


