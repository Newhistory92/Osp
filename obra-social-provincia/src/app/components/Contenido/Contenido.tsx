"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import parse from 'html-react-parser';
import YouTube from 'react-youtube';
import {useAppDispatch,useAppSelector} from "../../hooks/StoreHook"
import { setSelectedContent, setShowPrestadores,setShowWelcome } from '../../redux/Slice/navbarSlice';
const DynamicPrestadores = dynamic(() => import('../../User2/prestador/TablePrestador'));
import Welcome from '../Bienvenido/Bienvenido';
import "./video.css"
import "./scrollAnimation.css"

interface Props {
  children: React.ReactNode;
}

const Contenido = () => {
  const showPrestadores = useAppSelector(state => state.navbar.showPrestadores);
  const selectedContent = useAppSelector(state => state.navbar.selectedContent);
  const showWelcome = useAppSelector(state => state.navbar.showWelcome)
  const dispatch = useAppDispatch(); 

 



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

    return <div className="container-text overflow-auto animate-zoom-in animation-delay-1000 ">{parsedContent}</div>;
  };


  const getYouTubeVideoId = (url: string) => {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return videoIdMatch && videoIdMatch[1];
  };
 
  React.useEffect(() => {
    if (showPrestadores && selectedContent === null) {
        // Si showPrestadores está activo y no hay contenido seleccionado, muestra Prestadores
        dispatch(setShowWelcome(false));
    } else if (selectedContent !== null && !showPrestadores) {
        // Si hay contenido seleccionado y showPrestadores no está activo, desactiva showPrestadores y muestra el contenido seleccionado
        dispatch(setShowPrestadores(false));
        dispatch(setShowWelcome(false));
    }
     else {
        // En cualquier otro caso, asegúrate de que showPrestadores y selectedContent sean falsos y muestra la bienvenida
        dispatch(setShowPrestadores(false));
        dispatch(setSelectedContent(null));
        dispatch(setShowWelcome(true));
    }
}, [showPrestadores, selectedContent, dispatch]);


  

  



  return (
    <div className=" p-8 pr-4 w-full h-screen flex justify-center  mx-auto">
      {showWelcome && <Welcome />}
      {showPrestadores ? (
        < DynamicPrestadores />
      ) : selectedContent !== null ? ( 
        renderContentWithVideos(selectedContent)
      ) : null}
    </div>
  );
  
}
export default Contenido;

     