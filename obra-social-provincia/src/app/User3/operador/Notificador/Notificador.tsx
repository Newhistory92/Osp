import React, { useEffect, useState,useRef } from 'react';
import { useAppSelector } from "../../../hooks/StoreHook";
import NotificadosList from './NotificadosList';
import { Afiliado } from '@/app/interfaces/interfaces';
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Loading from '@/app/components/Loading/loading';
import { FileUpload } from 'primereact/fileupload';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { Button } from 'primereact/button';

import dynamic from 'next/dynamic';
const BundledEditor = dynamic(() => import ('@/BundledEditor'),{
  ssr:false
})


const Notificador = () => {
  const [dni, setDni] = useState('');
  const [afiliado, setAfiliado] = useState<Afiliado | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showButtons, setShowButtons] = useState(false); 
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const editorRef = useRef<any>(null);
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);

  let autorId;

  if (Array.isArray(currentUser)) {
      autorId = currentUser.length > 0 ? currentUser[0].id : null;
  } else {
      autorId = currentUser ? currentUser.id : null;
  }

  useEffect(() => {
    obtenerAfiliadoPorDNI(dni);
  }, [dni]);

  const obtenerAfiliadoPorDNI = async (dni: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/Notificador?dni=${dni}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (data.status === 200) {
          console.log('Afiliado encontrado:', data.afiliado);
          setAfiliado(data.afiliado);
          setMessage(`Afiliado encontrado: ${data.afiliado.name} ${data.afiliado.apellido}`);
          setMessageType('success');
          setShowButtons(true);
        } else if (data.status === 404) {
          console.log('Afiliado no encontrado');
          setMessage('Afiliado no encontrado');
          setMessageType('error');
          setShowButtons(false);
        }
      } else {
        console.error('Error en la solicitud:', data.error);
        setMessage('Error en la solicitud');
        setMessageType('error');
        setShowButtons(false);
      }
    } catch (error) {
      console.error('Error al obtener el Afiliado:', error);
      setMessage('Error al obtener el Afiliado');
      setMessageType('error');
      setShowButtons(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTituloChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitulo(event.target.value);
  };
  const handleFileUpload = (event: { files: any; }) => {
    const { files } = event;
    if (files && files.length > 0) {
        const file = files[0];
        setArchivo(file.objectURL);
    }
};


  const handleDniChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDni = event.target.value;
    setDni(newDni); // Actualiza el estado del número de DNI

    // Verifica si el campo de DNI está vacío y restablece el estado si es necesario
    if (newDni === '') {
      setAfiliado(null);
      setMessage('');
      setMessageType('');
      setShowButtons(false);
      setTitulo('');
      setContenido('');
  
    }
  };

  const handleEnviar = async () => {
    

    const contenido = editorRef.current ? editorRef.current.getContent() : '';

    if (!titulo || !contenido) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El título y el contenido son requeridos', life: 3000 });
      return;
    }

    // let archivoUrl = '';

    // if (archivo) {
    //   const formData = new FormData();
    //   formData.append('archivo', archivo);

    //   try {
    //     const response = await fetch('/api/subir-archivo', {
    //       method: 'POST',
    //       body: formData,
    //     });

    //     if (response.ok) {
    //       const data = await response.json();
    //       archivoUrl = data.url;
    //     } else {
    //       toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al subir el archivo', life: 3000 });
    //       return;
    //     }
    //   } catch (error) {
    //     console.error('Error al subir el archivo:', error);
    //     toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al subir el archivo', life: 3000 });
    //     return;
    //   }
    // }

    const notificacionData = {
      titulo,
      contenido,
      url: archivo, 
      autorId,
      receptorId: afiliado?.id 
    };

    setIsLoading(true);

    try {
      const response = await fetch('/api/Notificador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificacionData),
      });

      if (response.ok) {
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Notificación enviada exitosamente', life: 3000 });
        setTitulo('');
        if (editorRef.current) {
          editorRef.current.setContent('');
        }
        setArchivo(null);
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar la notificación', life: 3000 });
      }
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar la notificación', life: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    // Restablece el estado de todos los campos a su valor inicial
    setDni('');
    setAfiliado(null);
    setMessage('');
    setMessageType('');
    setShowButtons(false);
    setTitulo('');
    setContenido('');
  };
  


  const confirmEnviar = (event: { currentTarget: any; }) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
        accept: handleEnviar,
        reject: () => {
            toast.current?.show({ severity: 'info', summary: 'Cancelado', detail: 'La operación fue cancelada', life: 3000 });
        }
    });
};

const confirmCancelar = (event: { currentTarget: any; }) => {
  confirmDialog({
    message: 'Do you want to delete this record?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    defaultFocus: 'reject',
    acceptClassName: 'p-button-danger',
    accept: handleCancelar,
        reject: () => {
            toast.current?.show({ severity: 'info', summary: 'Cancelado', detail: 'La operación no fue cancelada', life: 3000 });
        }
    });
};

  
  return (
    <div>
       { isLoading && <Loading />} 
      <div className="mb-6">
        <label htmlFor="dni" className="block mb-2 text-sm font-medium text-black dark:text-black">
          Ingresa el Número de DNI del Afiliado
        </label>
        <input
          type="text"
          id="dni"
          value={dni}
          onChange={handleDniChange}
          className={`bg-${messageType === 'success' ? 'green' : 'red'}-50 border border-${messageType === 'success' ? 'green' : 'red'}-500 text-${messageType === 'success' ? 'green' : 'red'}-900 dark:text-${messageType === 'success' ? 'green' : 'red'}-400 placeholder-${messageType === 'success' ? 'green' : 'red'}-700 dark:placeholder-${messageType === 'success' ? 'green' : 'red'}-500 text-sm rounded-lg focus:ring-${messageType === 'success' ? 'green' : 'red'}-500 focus:border-${messageType === 'success' ? 'green' : 'red'}-500 block w-full p-2.5 dark:bg-gray-700 dark:border-${messageType === 'success' ? 'green' : 'red'}-500`}
          placeholder=" N° de DNI"
        />
        {message && (
          <p className={`mt-2 text-sm text-${messageType === 'success' ? 'green' : 'red'}-600 dark:text-${messageType === 'success' ? 'green' : 'red'}-500`}>
            <span className="font-medium">{messageType === 'success' ? 'Bien hecho!' : '¡Ups!'}</span> {message}
          </p>
        )}
      </div>

      {/* Información de contacto */}
      {messageType === 'success' && afiliado && (
        <div>
          <h2>Información de Contacto:</h2>
          <p>Phone: {afiliado?.phone}</p>
          <p>Email: {afiliado.email}</p>
          <p>Dirección: {afiliado.address}</p>
        </div>
      )}

      {messageType === 'success' && afiliado && (
        <div className="mb-6">
          <label htmlFor="titulo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Título del Mensaje
          </label>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
              </svg>
            </div>
            <input type="text" id="titulo" onChange={handleTituloChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="Título" />
          </div>
        </div>
      )}
            <BundledEditor
                       apiKey='0haatfl7x4pbf6bmbt9lleeg1naxzpdssmbl9csdor4lepi0'
        onInit={(_evt: any, editor: null) => editorRef.current = editor}
        init={{
          height: 500,
          indentation: '20pt',
          indent_use_margin: true,
          branding:false,
          preview_styles: false,
          content_css: false,
          table_header_type: 'sectionCells',
          table_sizing_mode: 'responsive',
          table_column_resizing: 'resizetable',
          link_default_target: '_blank',
          autosave_interval: '20s',
          emoticons_database: 'emojiimages',
          plugins: [
            'advlist', 'anchor', 'link', 'image', 'lists','media','preview',
            'searchreplace', 'table', 'wordcount','link ','autosave','searchreplace','emoticons',
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' + 'fontfamily | fontsize'+
            'alignright alignjustify | bullist numlist outdent indent | searchreplace' +
            'link  media image code emoticons' +'preview',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          formats: {
            alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'left' },
            aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'center' },
            alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'right' },
            alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'full' }
            
          },
          font_family_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
          font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
          file_picker_types: 'file image media',
          image_title: true,
          automatic_uploads: true,
          image_advtab: true,
          media_live_embeds: true,
          
        }}
      />
   

      {messageType === 'success' && afiliado && ( 
     <div className="card">
     <FileUpload 
                       name="demo[]"
                        url="/api/subir-archivo" 
                        accept=".pdf" 
                        maxFileSize={1000000} 
                         onUpload={handleFileUpload} 
                        emptyTemplate={<p className="m-0">Arrastre y suelte archivos aquí para cargarlos.</p>} 
                    />
     </div>
      )}

      {showButtons && (
        <><Toast ref={toast} /><ConfirmDialog /><div className="card flex flex-wrap gap-2 justify-content-center">
          <Button onClick={confirmEnviar} icon="pi pi-check" label="Confirm" className="mr-2"></Button>
          <Button onClick={confirmCancelar} icon="pi pi-times" label="Delete"></Button>
        </div></>
      )}
             
    
     {messageType !== 'success' && <NotificadosList autorId={autorId} />} 
    
    </div>
  );
};

export default Notificador;






