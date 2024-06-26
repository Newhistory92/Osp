import React, { useEffect, useState,useRef } from 'react';
import { useAppSelector } from "../../../hooks/StoreHook";
import NotificadosList from './NotificadosList';
import { Afiliado,Prestador } from '@/app/interfaces/interfaces';
import { Toast } from 'primereact/toast';
import Loading from '@/app/components/Loading/loading';
import { FileUpload } from 'primereact/fileupload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dynamic from 'next/dynamic';
const BundledEditor = dynamic(() => import ('@/BundledEditor'),{
  ssr:false
})


const Notificador = () => {
  const [dni, setDni] = useState('');
  const [matricula, setMatricula] = useState('');
  const [userType, setUserType] = useState('');
  const [afiliado, setAfiliado] = useState<Afiliado | null>(null);
  const [prestador, setPrestador] = useState<Prestador | null>(null);
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
    if (userType === 'dni') {
        obtenerAfiliadoPorDNI(dni);
    } else if (userType === 'matricula') {
        obtenerPrestadorPorMatricula(matricula);
    }
}, [dni, matricula]);

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

  const obtenerPrestadorPorMatricula = async (matricula: string) => {
    console.log(`Buscando prestador por matrícula: ${matricula}`);
    setIsLoading(true);
    try {
        const response = await fetch(`/api/Notificador?matricula=${matricula}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (response.ok && data.status === 200) {
            setPrestador(data.prestador);
            setMessage(`Prestador encontrado: ${data.prestador.name} ${data.prestador.apellido}`);
            setMessageType('success');
            setShowButtons(true);
        } else {
            setMessage('Prestador no encontrado');
            setMessageType('error');
            setShowButtons(false);
        }
    } catch (error) {
        console.log('Error al obtener el Prestador:', error);
        setMessage('Error al obtener el Prestador');
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
    setDni(newDni); 
    if (newDni === '') {
      setAfiliado(null);
      setMessage('');
      setMessageType('');
      setShowButtons(false);
      setTitulo('');
      setContenido('');
  
    }
  };


  const handleMatriculaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMatricula = event.target.value;
    setMatricula(newMatricula);
    if (newMatricula === '') {
      setPrestador(null);
      setMessage('');
      setMessageType('');
      setShowButtons(false);
      setTitulo('');
      setContenido('');
    }
  };


  const handleUserTypeChange = (event: SelectChangeEvent) => {
    setUserType(event.target.value);
    setDni('');
    setMatricula('');
    setAfiliado(null);
    setPrestador(null);
    setMessage('');
    setMessageType('');
    setShowButtons(false);
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


    const receptorId = afiliado ? afiliado.id : null;
    const receptorPrestadorId = prestador ? prestador.id : null;
  
    if (!receptorId && !receptorPrestadorId) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un afiliado o un prestador', life: 3000 });
      return;
    }
    const notificacionData = {
      titulo,
      contenido,
      url: archivo, 
      autorId,
      receptorId: receptorId, 
      receptorPrestadorId: receptorPrestadorId
    };

    setIsLoading(true);
    console.log(notificacionData)
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
    setTitulo('');
    setDni('');
    setMatricula('');
    setAfiliado(null);
    setPrestador(null);
    setMessage('');
    setMessageType('');
    setShowButtons(false);
    if (editorRef.current) {
        editorRef.current.setContent('');
        toast.current?.show({ severity: 'info', summary: 'Cancelado', detail: 'La operación fue cancelada', life: 3000 });
    }
  
};

  

  

    return (
      <div className="container mx-auto p-4">
          {isLoading && <Loading />}
          <div className="mb-6">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="user-type-select-label">Buscar por</InputLabel>
                    <Select
                        labelId="user-type-select-label"
                        id="user-type-select"
                        value={userType}
                        label="Buscar por"
                        onChange={handleUserTypeChange}
                    >
                        <MenuItem value="dni">DNI</MenuItem>
                        <MenuItem value="matricula">Matrícula</MenuItem>
                    </Select>
                </FormControl>
                <input
                    type="text"
                    id="identifier"
                    value={userType === 'dni' ? dni : matricula}
                    onChange={userType === 'dni' ? handleDniChange : handleMatriculaChange}
                    disabled={!userType}
                    className={`bg-${messageType === 'success' ? 'green' : 'red'}-50 border border-${messageType === 'success' ? 'green' : 'red'}-500 text-${messageType === 'success' ? 'green' : 'red'}-900 placeholder-${messageType === 'success' ? 'green' : 'red'}-700 text-sm rounded-lg focus:ring-${messageType === 'success' ? 'green' : 'red'}-500 focus:border-${messageType === 'success' ? 'green' : 'red'}-500 block w-full p-2.5`}
                    placeholder={userType === 'dni' ? "N° de DNI" : "Matrícula"}
                />
                {message && (
                    <p className={`mt-2 text-sm text-${messageType === 'success' ? 'green' : 'red'}-600`}>
                        <span className="font-medium">{messageType === 'success' ? 'Bien hecho!' : '¡Ups!'}</span> {message}
                    </p>
                )}
            </div>


            {messageType === 'success' && (afiliado || prestador) && (
              <div>
                  <h2 className="text-xl font-semibold mb-4">Información de Contacto:</h2>
                  <p><strong>Phone:</strong> {afiliado?.phone || prestador?.phone}</p>
                  <p><strong>Email:</strong> {afiliado?.email || prestador?.email}</p>
                  <p><strong>Dirección:</strong> {afiliado?.address || prestador?.address}</p>
              </div>
          )}

                {messageType === 'success' && (afiliado || prestador) && (
              <div className="mb-6">
                  <label htmlFor="titulo" className="block mb-2 text-sm font-medium text-gray-900">
                      Título del Mensaje
                  </label>
                  <div className="relative mb-6">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                              <path d="M10.036 8.278l9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                          </svg>
                      </div>
                      <input
                          type="text"
                          id="titulo"
                          value={titulo}
                          onChange={handleTituloChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                          placeholder="Título"
                      />
                  </div>
              </div>
          )}

        {messageType === 'success' && (afiliado || prestador) && (
              
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
          )}

          {messageType === 'success' && afiliado && (
              <div className="card mt-6">
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

          {messageType === 'success' && afiliado && (
              <div className=" flex justify-between flex-wrap justify-content-center gap-3">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleEnviar}>
                Enviar
              </button>
              <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          )}

          <Toast ref={toast} />
         

          {messageType !== 'success' && <NotificadosList autorId={autorId} />}
      </div>
  );
};


export default Notificador;







