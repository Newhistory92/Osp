"use client"

import React from 'react';
import NumberTicker from './number-ticker';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import { orange } from '@mui/material/colors';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

const Statistic: React.FC = () => {
  return (
    <section className="text-gray-400  bg-gray-900 body-font overflow-hidden">
    <div className="mx-auto px-5 py-5">
      <div className="flex flex-col text-center w-full mb-20">
        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">Nuestra Mision</h1>
        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Atender las necesidades de los afiliados, brindando las prestaciones de salud y los beneficios sociales establecidos en el marco de la ley, mediante procesos que aseguren transparencia, calidad y eficiencia, promoviendo un ambiente de trabajo en equipo, comprometido y con un profundo sentido de respeto, humildad y servicio.</p>
      </div>
      <div className="flex flex-wrap -m-4 text-center">
        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
          <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
            < GroupAddOutlinedIcon sx={{ color: orange[400], fontSize: 40}}/>
            <h2 className="title-font font-medium text-3xl text-white">  <NumberTicker value={5000} />K </h2>
            <p className="leading-relaxed text-center">Prestadores de Servicios</p>
          </div>
        </div>
        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
          <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
          <FamilyRestroomOutlinedIcon sx={{ color: orange[400], fontSize: 40}} /> 
            <h2 className="title-font font-medium text-3xl text-white"><NumberTicker value={15000} />K </h2>
            <p className="leading-relaxed text-center"> Afiliados</p>
          </div>
        </div>
        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
          <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
          <AccessTimeOutlinedIcon sx={{ color: orange[400], fontSize: 40}}/>
            <h2 className="title-font font-medium text-3xl text-white "><NumberTicker value={60} />Años </h2>
            <p className="leading-relaxed text-center">Satifaciendo las necesidades de nuestros Afiliados</p>
          </div>
        </div>
        {/* <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
          <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="text-yellow-400 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <h2 className="title-font font-medium text-3xl text-white">46</h2>
            <p className="leading-relaxed">Places</p>
          </div>
        </div> */}
      </div>
    </div>
  </section>
  );
}

export default Statistic;