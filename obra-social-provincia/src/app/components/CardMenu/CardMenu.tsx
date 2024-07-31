"use client"

import React from 'react';
import "./cardMenu.scss"
import {setSelectedContent} from '../../redux/Slice/navbarSlice'
import {useAppDispatch,useAppSelector} from "../../hooks/StoreHook"
import dynamic from 'next/dynamic';
const DynamicModal = dynamic(() => import('@nextui-org/react').then(mod => mod.Modal));
const DynamicModalContent = dynamic(() => import('@nextui-org/react').then(mod => mod.ModalContent));
const DynamicModalHeader = dynamic(() => import('@nextui-org/react').then(mod => mod.ModalHeader));
const DynamicModalBody = dynamic(() => import('@nextui-org/react').then(mod => mod.ModalBody));
const DynamicModalFooter = dynamic(() => import('@nextui-org/react').then(mod => mod.ModalFooter));
const DynamicButton = dynamic(() => import('@nextui-org/react').then(mod => mod.Button));
import { useDisclosure,Input} from "@nextui-org/react";
import parse from 'html-react-parser';
import YouTube from 'react-youtube';


const CardMenu: React.FC = () => {
    const publicaciones = useAppSelector(state => state.navbar.publicaciones);
    const selectedContent = useAppSelector(state => state.navbar.selectedContent);
    const dispatch = useAppDispatch(); 
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [value, setValue] = React.useState("12345678");


    const validateDni = (value: string) => /^\d{7,8}$/.test(value);

    const isInvalid = React.useMemo(() => {
      if (value === "") return false;
      return !validateDni(value);
    }, [value]);




    const handleTitleClick = (contenido: string) => {
        if (selectedContent !== contenido) {
          dispatch(setSelectedContent(contenido));
        } else {
          dispatch(setSelectedContent(null));
        }
      };
    

      const openModa = (p0: { onOpen: () => void; }) => {
        onOpen();
      };
    return (
        <section>
            
                <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="card-menu">
                        <div className="cover-menu item-a">
                            <h1>Formulario<br />Pacientes Cronicos</h1> 
                            <div className="card-back"> 
                         
                                <a href="#" onClick={() => openModa({onOpen})}>Formulario</a>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="card-menu">
                        <div className="cover-menu item-b">
                            <h1>Istitucional</h1>                           
                            <div className="card-back">
              <ul>
                {publicaciones.filter(publicacion => publicacion.published === "institucional").map((publicacion, index) => (
                  <li key={index}>
                    <a href="#" onClick={() => handleTitleClick(publicacion.contenido)}>
                      {publicacion.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4 col-sm-6 col-xs-12">
        <div className="card-menu">
          <div className="cover-menu item-c">
            <h1>Programas</h1>
            <div className="card-back">
              <ul>
                {publicaciones.filter(publicacion => publicacion.published === "programas").map((publicacion, index) => (
                  <li key={index}>
                    <a href="Formulario_Cronico" onClick={() => handleTitleClick(publicacion.contenido)}>
                      {publicacion.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
            
      <DynamicModal
                backdrop="opaque"
                size={"4xl"} 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                radius="lg"
                classNames={{
                  body: "py-6",
                  base: "border-[#1f2833] bg-[#F0F0F0] dark:bg-[#161C24] text-[#505155]",
                  header: "border-b-[1px] border-[#1f2833]",
                  footer: "border-t-[1px] border-[#1f2833]",
                  closeButton: "hover:bg-black/5 active:bg-black/10",
                }} >
                 <DynamicModalContent>
                   {(onClose) => (
                       <>
             <DynamicModalHeader className="flex flex-col gap-1">Obra Social Provincia</DynamicModalHeader>
             <DynamicModalBody>

              <iframe
                  src="https://sdf.tandemdigital.net/generador-formulario-cronicos"
                  width="100%"
                  height="400px"
                  title="Formulario Pacientes Crónicos"
                />
              </DynamicModalBody>
              <DynamicModalFooter>
                <DynamicButton color="danger" variant="light" onPress={onClose}>
                  Cerrar
                  </DynamicButton>
                  </DynamicModalFooter>
            </>
          )}
       </DynamicModalContent>
       </DynamicModal>
        </section>
    );
}

export default CardMenu;
