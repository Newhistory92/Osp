import React, { useEffect, useState,useRef } from 'react';
import { useAppSelector } from "../../../hooks/StoreHook";
import { ToastContainer, toast } from 'react-toastify';
import NotificadosList from './NotificadosList';
import { Afiliado } from '@/app/interfaces/interfaces';
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
  const [resetEditorContent, setResetEditorContent] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const editorRef = useRef<any>(null);



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

  const obtenerAfiliadoPorDNI = async (dni:string) => {
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
          setShowButtons(true); // Mostrar los botones cuando haya éxito
        } else if (data.status === 404) {
          console.log('Afiliado no encontrado');
          setMessage('Afiliado no encontrado');
          setMessageType('error');
          setShowButtons(false); // Ocultar los botones si no se encuentra el afiliado
        }
      } else {
        console.error('Error en la solicitud:', data.error);
        setMessage('Error en la solicitud');
        setMessageType('error');
        setShowButtons(false); // Ocultar los botones en caso de error en la solicitud
      }
    } catch (error) {
      console.error('Error al obtener el Afiliado:', error);
      setMessage('Error al obtener el Afiliado');
      setMessageType('error');
      setShowButtons(false); // Ocultar los botones en caso de error al obtener el afiliado
    }
  };

  const handleTituloChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitulo(event.target.value);
  };

  const handleArchivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setArchivo(file);
    } else {
      // Manejo si no se selecciona ningún archivo
      console.error('No se ha seleccionado ningún archivo');
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
      setResetEditorContent(true); // Esto reiniciará el contenido del editor
    }
  };

  const handleContenidoChange = () => {
    if (editorRef.current) {
      const contenido = editorRef.current.getContent();
    setContenido(contenido);
  };
}
  const handleEnviar = async () => {
    try {
        if (!archivo) {
            console.error('No se ha seleccionado ningún archivo');
            return;
        }

        const formData = new FormData();
        formData.append('archivo', archivo);

        const response = await fetch('/api/subir-archivo', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            const archivoUrl = data.url;

            const nuevaNotificacion = {
                receptorId: afiliado?.id,
                autorId: autorId,
                titulo: titulo,
                contenido: contenido,
                url: archivoUrl
            };

            const responseNotificacion = await fetch('/api/Publicaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaNotificacion),
            });

            // Aquí puedes manejar la respuesta si es necesario
            const responseData = await responseNotificacion.json();
            toast.success('Notificación enviada con éxito:');

            // Reinicia el estado del título, contenido y editor después de enviar
            setTitulo('');
            setContenido('');
            setResetEditorContent(true); // Esto reiniciará el contenido del editor
        } else {
          toast.error('Error al cargar el archivo');
        }
    } catch (error:any) {
      toast.info('Error al enviar la notificación:', error);
        // Puedes manejar el error de manera adecuada aquí, como mostrar un mensaje al usuario
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
    setResetEditorContent(true); // Esto reiniciará el contenido del editor
  };

  return (
    <div>
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
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Cargar Archivo</label>
          <input
            onChange={handleArchivoChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PDF, WORD.</p>
        </div>
      )}

      {showButtons && (
        <div className="flex justify-between">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleEnviar}>
            Enviar
          </button>
          <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      )}
     <ToastContainer/>
    
     {messageType !== 'success' && <NotificadosList autorId={autorId} />} 
    
    </div>
  );
};

export default Notificador;






