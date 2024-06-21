

import React, { useState, useEffect,useRef,useCallback } from 'react';
import { debounce } from 'lodash';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { Button, TextField, List, ListItem, ListItemText, Modal, ListSubheader, Fab, Typography } from '@mui/material';
import { crearPublicacion, actualizarPublicacion,deletePublicacion } from '../../../api/Datos/Publicacion/ApiPublicacion';
import { useAppSelector } from "../../../hooks/StoreHook";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DrawIcon from '@mui/icons-material/Draw';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'
import AddIcon from '@mui/icons-material/Add';
import { PublicacionEdit } from '@/app/interfaces/interfaces';
import dynamic from 'next/dynamic';
import tinymce from 'tinymce/tinymce';
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const BundledEditor = dynamic(() => import ('@/BundledEditor'),{
    ssr:false
})


export default function EditPublicacion() {
    const [showForm, setShowForm] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [published, setPublished] = useState('');
    const [publicaciones, setPublicaciones] = useState<PublicacionEdit[]>([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingPublicacion, setEditingPublicacion] = useState< PublicacionEdit | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deletingPublicacion, setDeletingPublicacion] = useState< PublicacionEdit | null>(null);
    const currentUser = useAppSelector(state => state.user.currentUser);
    const toast = useRef<Toast>(null);
    const editorRef = useRef<any>(null);





    let autorId;


    if (Array.isArray(currentUser)) {
        autorId = currentUser.length > 0 ? currentUser[0].id : null;
    } else {
        autorId = currentUser ? currentUser.id : null;
    }

 
    const handleTituloChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitulo(event.target.value);
    };

    const handleSelectChange =(event: React.ChangeEvent<HTMLSelectElement>) => {
        setPublished(event.target.value);
        setShowForm(false);
    }
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (editorRef.current) {
            const contenido = editorRef.current.getContent();
            
    
            const nuevaPublicacion = {
                published: published,
                titulo: titulo,
                contenido: contenido,
                autorId: autorId
            };
    
            try {
                await crearPublicacion(nuevaPublicacion);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'La publicación se creó exitosamente', life: 3000 });
            } catch (error) {
                console.error('Error al crear la publicación:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al crear la publicación', life: 3000 });
            }
    
            setTitulo('');
            setContenido('');
            setPublished('');
            setShowForm(false);
        }
    };
    const GetPublic = async () => {
        try {
            const response = await fetch(`/api/Publicaciones?published=${published}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las publicaciones: ' + response.statusText);
            }
            const data = await response.json();
            if (data.status === 200) {
                setPublicaciones(data.publicaciones);
            } else {
                setPublicaciones([]);
                console.error('Error: La respuesta del servidor está vacía.');
            }
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
        }
    };

    const debouncedGetPublic = useCallback(debounce(GetPublic, 300), [published]);

    useEffect(() => {
        if (published) {
            const handler = debounce(() => {
                GetPublic();
            }, 300);

            handler();

            return () => {
                handler.cancel();
            };  }
    }, [published]);


    const handleEditPublicacion = (publicacion: PublicacionEdit) => {
        console.log(publicacion)
        setEditingPublicacion(publicacion);
        setTitulo(publicacion.titulo);
        setContenido(publicacion.contenido);
        setEditModalOpen(true);
    };

    const handleAcceptEdit = async () => {
        try {
            if (editingPublicacion) {
                console.log("ID de la publicación a actualizar:", editingPublicacion.id);
                await actualizarPublicacion(editingPublicacion.id, {
                    titulo: titulo,
                    contenido: contenido
                });
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'La publicación se actualizó exitosamente', life: 3000 });

                setEditModalOpen(false);
            } else {
                console.error('No se puede actualizar la publicación porque es nula.');
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se puede actualizar la publicación porque es nula.', life: 3000 });
            }
        } catch (error) {
            console.error('Error al actualizar la publicación:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la publicación', life: 3000 });
        }
    };
    
    
    const handleDeletePublicacion = async (publicacion: PublicacionEdit) => {
        try {
            await deletePublicacion(publicacion.id);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'La publicación se eliminó exitosamente', life: 3000 });
          setShowDeleteConfirmation(false);
          setDeletingPublicacion(null);
        } catch (error: any) {
            console.error('Error al eliminar la publicación:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la publicación', life: 3000 });
      };}

    const handleCloseModal = () => {
        setEditModalOpen(false);
    };





    const handleFilePicker = (cb: (url: string, meta: { title: string }) => void, value: string, meta: { filetype: string }) => {
        // const input = document.createElement('input');
        // input.setAttribute('type', 'file');
        // input.setAttribute('accept', 'image/*');
    
        // input.addEventListener('change', (e) => {
        //   const target = e.target as HTMLInputElement;
        //   const file = target.files ? target.files[0] : null;
          
        //   if (file) {
        //     const reader = new FileReader();
        //     reader.addEventListener('load', () => {
        //       const editor = tinymce.activeEditor;
        //       if (editor) {
        //         const id = 'blobid' + (new Date()).getTime();
        //         const blobCache = editor.editorUpload.blobCache;
        //         const base64 = (reader.result as string).split(',')[1];
        //         const blobInfo = blobCache.create(id, file, base64);
        //         blobCache.add(blobInfo);
                
        //         // Call the callback and populate the Title field with the file name
        //         cb(blobInfo.blobUri(), { title: file.name });
        //       }
        //     });
        //     reader.readAsDataURL(file);
        //   }
        // });
      
        // input.click();
      };
    return (
        <div className='bg-white rounded-lg'>
            <Box sx={{ minWidth: 120 }}>
            <Fab size="medium" color="secondary" aria-label="add">
        <AddIcon />
      </Fab>
      <Fab  color="secondary" size="medium" aria-label="edit">
  <DeleteSweepIcon />
</Fab>
                <FormControl fullWidth>
                    <InputLabel 
                    variant="standard" 
                    htmlFor="select-categoria"
                    className='ml-5'>
                        Seleccionar categoría
                    </InputLabel>
                    <NativeSelect
                        value={published}
                        className='ml-5'
                        onChange={handleSelectChange}
                        inputProps={{
                            name: 'published',
                            id: 'select-categoria',
                        }}
                    >
                        <option value="">Seleccionar</option>
                        <option value="afiliaciones">Afiliaciones</option>
                        <option value="farmacia">Farmacia</option>
                        <option value="institucional">Institucional</option>
                        <option value="prestadores">Prestadores</option>
                        <option value="servicios">Servicios</option>
                        <option value="programas">Programas</option>
                       
                    </NativeSelect>
                </FormControl>
            </Box>
            {publicaciones.length > 0 && published && (
               <List
               sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
               component="nav"
               aria-labelledby="Publicaciones"
               subheader={
                   <ListSubheader component="div" id="nested-list-subheader">
                       Publicaciones de {published}
                   </ListSubheader>
               }
           >
               {publicaciones.map((publicacion, index) => (
                   <ListItem key={index}>
                       <ListItemText 
                           primary={publicacion.titulo}
                           secondary={
                               <>
                                   <Typography variant="body2">
                                       {`Autor: ${publicacion.autor.name} ${publicacion.autor.apellido}`}
                                   </Typography>
                                   <Typography variant="body2" color="textSecondary">
                                   {`Actualizado: ${format(new Date(publicacion.updatedAt), 'eeee d/MM/yyyy', { locale: es })}`}
                                </Typography>
                                   </>
                               
                           }
                       />
                       <ModeEditIcon className='mr-2 ' onClick={() => handleEditPublicacion(publicacion)} />
                       <DeleteSweepIcon onClick={() => { setShowDeleteConfirmation(true); setDeletingPublicacion(publicacion); }} />
                   </ListItem>
               ))}
                 <Modal
                open={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                aria-labelledby="modal-delete-publicacion"
                aria-describedby="modal-delete-publicacion-description"
            >
                <div className='fixed inset-0 flex items-center justify-center '>
                    <div className='bg-white p-8 rounded-lg'>
                        <Typography variant="h6" gutterBottom>
                            ¿Deseas eliminar esta publicación?
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={() => handleDeletePublicacion(deletingPublicacion!)} color="primary">
                                Sí
                            </Button>
                            <Button onClick={() => setShowDeleteConfirmation(false)} color="secondary">
                                No
                            </Button>
                        </Box>
                    </div>
                </div>
            </Modal>
           </List>
           
            )}

            {!showForm && published && (
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab onClick={() => setShowForm(true)}  variant="extended" size="small" color="primary">
                        < DrawIcon sx={{ mr: 1 }}  />
                        Crear Nueva Publicación
                    </Fab>
                </Box>
            )}

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Título"
                        value={titulo}
                        onChange={handleTituloChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                     <BundledEditor
                       apiKey='0haatfl7x4pbf6bmbt9lleeg1naxzpdssmbl9csdor4lepi0'
        onInit={(_evt: any, editor: null) => editorRef.current = editor}
  
        initialValue='<p>This is the initial content of the editor.</p>'
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
          file_picker_callback: handleFilePicker,
        }}
      />
                   
                    <Button className='ms-5 mt-5' type="submit" variant="contained" color="primary">
                        Publicar
                    </Button>
                    <Button onClick={() => {
                        setShowForm(false);
                        setTitulo('');
                        setContenido('');
                    }} className='ms-5 mt-5' variant="contained" color="secondary">
                        Cancelar
                    </Button>
                </form>
            )}
<div className="card flex justify-content-center">
            <Toast ref={toast} position="bottom-center"/>
                 </div>
              <Modal
              open={editModalOpen}
             onClose={handleCloseModal}
             aria-labelledby="modal-edit-publicacion"
             aria-describedby="modal-edit-publicacion-description"
               >
            <div className='fixed inset-0 flex items-center justify-center overflow-y-auto'>
             <div className='bg-white rounded-lg h-screen  '>
            <h2 id="modal-edit-publicacion" className='text-lg font-bold mb-4'>Editar Publicación</h2>
            <TextField
                label="Título"
                value={titulo}
                onChange={handleTituloChange}
                fullWidth
                required
                margin="normal"
                className='mb-4'
            />
            <BundledEditor
                       apiKey='0haatfl7x4pbf6bmbt9lleeg1naxzpdssmbl9csdor4lepi0'
        onInit={(_evt: any, editor: null) => editorRef.current = editor}
  
        initialValue='<p>This is the initial content of the editor.</p>'
        init={{
          height: 500,
          indentation: '20pt',
          indent_use_margin: true,
          branding:false,
          preview_styles: false,
          browser_spellcheck: true,
          spellchecker_language: 'Spanish=es',
          table_header_type: 'sectionCells',
          table_sizing_mode: 'responsive',
          table_column_resizing: 'resizetable',
          link_default_target: '_blank',
          autosave_interval: '20s',
          emoticons_database: 'emojiimages',
          plugins: [
            'advlist', 'anchor', 'link', 'image', 'lists','media','preview',
            'searchreplace', 'table', 'wordcount','tinymcespellchecker','link ','autosave','searchreplace','emoticons',
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
          file_picker_callback: handleFilePicker,
        }}
      />
            <div className='mt-4 flex justify-between'>
                <Button onClick={handleAcceptEdit} variant="contained" color="primary">
                    Aceptar
                </Button>
                <Button onClick={handleCloseModal} variant="contained" color="secondary">
                    Cancelar
                </Button>
            </div>
        </div>
    </div>
</Modal>

        </div>
    );
}
