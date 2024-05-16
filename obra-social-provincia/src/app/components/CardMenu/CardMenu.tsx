"use client"

import React from 'react';
import "./cardMenu.scss"
import {setSelectedContent} from '../../redux/Slice/navbarSlice'
import {useAppDispatch,useAppSelector} from "../../hooks/StoreHook"
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,Input} from "@nextui-org/react";
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




    const renderContentWithVideos = (content: string) => {
      const parsedContent = parse(content, {
        replace: (domNode) => {
          if (domNode.type === 'tag' && domNode.name === 'oembed' && domNode.attribs?.url?.includes('youtube.com')) {
            const videoUrl = domNode.attribs?.url;
            if (videoUrl) {
              const videoId = getYouTubeVideoId(videoUrl);
              if (videoId) {
                return (
                  <div className="video-container">
                    <YouTube videoId={videoId} />
                  </div>
                );
              }
            }
          }
          return domNode;
        },
      });
  
      return parsedContent;
    };
  
  
    const getYouTubeVideoId = (url: string) => {
      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
      return videoIdMatch && videoIdMatch[1];
    };


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
                         
                                <a href="#" onClick={() => openModa({onOpen})}>Ver detalles</a>
                                
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
                                    <li>
                                    {publicaciones.map((publicacion, index) => (
                 publicacion.published === "istitucional" && (
                    <a key={index} href="#"  onClick={() => handleTitleClick(publicacion.contenido)}>
                    {publicacion.titulo}
                  </a> )))}
                                    </li>
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
                                    <li>
                                    {publicaciones.map((publicacion, index) => (
                 publicacion.published === "istitucional" && (
                    <a key={index} href="#"  onClick={() => handleTitleClick(publicacion.contenido)}>
                    {publicacion.titulo}
                  </a> )))}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            
             <Modal
                backdrop="opaque"
                size={"4xl"} 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                radius="lg"
                classNames={{
                  body: "py-6",
                  backdrop: "bg-[#1f2833]/50 backdrop-opacity-40",
                  base: "border-[#1f2833] bg-[#161C24] dark:bg-[#161C24] text-[#505155]",
                  header: "border-b-[1px] border-[#1f2833]",
                  footer: "border-t-[1px] border-[#1f2833]",
                  closeButton: "hover:bg-white/5 active:bg-white/10",
                }} >
                <ModalContent>
                   {(onClose) => (
                       <>
              <ModalHeader className="flex flex-col gap-1">Obra Social Provincia</ModalHeader>
              <ModalBody>
             
              <Input 
               type="text"
               variant="bordered"
               isClearable
               onClear={() => setValue("")}
               classNames={{
                label: "text-black/50 dark:text-white/90",
               input: [
                "bg-transparent",
                "text-white/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
               placeholder="Ingre el DNI del Paciente"
               value={value}
               isInvalid={isInvalid}
              color={isInvalid ? "danger" : "success"}
              errorMessage={isInvalid && "DNI Invalido"}
              onValueChange={setValue} />

              
              {publicaciones.map((publicacion) => {
            if (publicacion.published === "formularioconico") {
              return renderContentWithVideos(publicacion.contenido);
            }
            return null;
          })}
              
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button className="bg-[#FE8400] shadow-lg shadow-indigo-500/20" onPress={onClose}>
                  Imprimir
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </section>
    );
}

export default CardMenu;
