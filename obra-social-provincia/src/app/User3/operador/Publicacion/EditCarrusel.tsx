import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import AddIcon from '@mui/icons-material/Add';
import {Fab} from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import UploadImag from '@/app/components/FileUploa/TemplateDemo';
import { Toast } from 'primereact/toast';
import { setLoading } from '@/app/redux/Slice/loading';
import {useAppDispatch } from "../../../hooks/StoreHook";

const EditCarrusel = React.forwardRef(function EditCarrusel(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);
  const [tituloPrincipal, setTituloPrincipal] = React.useState('');
  const [tituloSecundario, setTituloSecundario] = React.useState('');
  const [contenido, setContenido] = React.useState('');
  const [archivoBase64, setArchivoBase64] = React.useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const dispatch =useAppDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const resetStates = () => {
    setTituloPrincipal('');
    setTituloSecundario('');
    setContenido('');
    setArchivoBase64(null);
  };
  const handleConfirm = async () => {
    const nuevoCarrusel = {
      tituloprincipal: tituloPrincipal,
      titulosecundario: tituloSecundario,
      contenido,
      urlImagen: archivoBase64
    };
  
    dispatch(setLoading(true));
  
    try {
      const response = await fetch('/api/Publicaciones/carrusel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCarrusel),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Notificación enviada exitosamente', life: 3000 });
        resetStates();
        handleClose();
        return responseData;
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el item de carrusel', life: 3000 });
      }
    } catch (error) {
      console.error('Error al crear el item de carrusel:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el item de carrusel', life: 3000 });
    } finally {
      dispatch(setLoading(false));
    }
  };
  


  return (
    <React.Fragment>
      <Fab size="medium" color="secondary" aria-label="add">
        <AddIcon  onClick={handleClickOpen}/>
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={EditCarrusel}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
             Banner
            </Typography>
            <Button autoFocus color="inherit" onClick={handleConfirm}>
              Confirmar
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary="Titulo Secuandario" secondary="Este Titulo aparece sobre el  titulo Principal y tiene un menor tamaño" />
            <Box
      sx={{
        width: 500,
        maxWidth: '100%',
      }}
    >
            <TextField
          id="outlined-multiline-static"
          label="Titulo Secundario"
          multiline
          fullWidth
          rows={5}
          value={tituloSecundario}
          onChange={(e) => setTituloSecundario(e.target.value)}
        />
        </Box>
          </ListItemButton>
          <Divider />
          <ListItemButton>
          <ListItemText primary="Titulo Principal" secondary="Este Titulo aparece en Negrita y se encuentra debajo del titulo secundario" />
            <Box
      sx={{
        width: 500,
        maxWidth: '100%',
      }}
    >
            <TextField
          id="outlined-multiline-static"
          label="Titulo Principal"
          multiline
          fullWidth
          rows={5}
          value={tituloPrincipal}
          onChange={(e) => setTituloPrincipal(e.target.value)}
        />
        </Box>
          </ListItemButton>
          <Divider />
          <ListItemButton>
          <ListItemText primary="Cuerpo" secondary="Ingresa el Contenido " />
            <Box
      sx={{
        width: 500,
        maxWidth: '100%',
      }}
    >
            <TextField
          id="outlined-multiline-static"
          label="Contenido Principal"
          multiline
          fullWidth
          rows={8}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        
        />
        </Box>
          </ListItemButton>
          <Divider />
          <UploadImag onFileUpload={setArchivoBase64} />
        </List>
     
      </Dialog>
    </React.Fragment>
  );
}
