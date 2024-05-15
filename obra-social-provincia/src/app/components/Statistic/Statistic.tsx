"use client"
import React from 'react';
import NumberTicker from './number-ticker';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import { orange } from '@mui/material/colors';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

const Statistic: React.FC = () => {
  return (
    <section className="w-full text-gray-400 bg-gradient-to-b from-transparent via-gray-900 to-gray-900 body-font overflow-hidden">
        <div className="container mx-auto px-5 py-5 w-full">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4  text-white  ">Nuestra Mision</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base ">
            Atender las necesidades de los afiliados, brindando las prestaciones de salud y los beneficios sociales establecidos en el marco de la ley, mediante procesos que aseguren transparencia, calidad y eficiencia, promoviendo un ambiente de trabajo en equipo, comprometido y con un profundo sentido de respeto, humildad y servicio.
          </p>
        </div>
        <div className="flex flex-wrap -m-4 text-center">
          <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
            <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
              <GroupAddOutlinedIcon sx={{ color: orange[400], fontSize: 40 }} />
              <h2 className="title-font font-medium text-3xl text-white">
                <NumberTicker value={5000} />K
              </h2>
              <p className="leading-relaxed text-center">Prestadores de Servicios</p>
            </div>
          </div>
          <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
            <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
              <FamilyRestroomOutlinedIcon sx={{ color: orange[400], fontSize: 40 }} />
              <h2 className="title-font font-medium text-3xl text-white">
                <NumberTicker value={15000} />K
              </h2>
              <p className="leading-relaxed text-center">Afiliados</p>
            </div>
          </div>
          <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
            <div className="border-2 border-gray-800 px-4 py-3 rounded-lg">
              <AccessTimeOutlinedIcon sx={{ color: orange[400], fontSize: 40 }} />
              <h2 className="title-font font-medium text-3xl text-white">
                <NumberTicker value={60} />Años
              </h2>
              <p className="leading-relaxed text-center">Satifaciendo las necesidades de nuestros Afiliados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistic;
