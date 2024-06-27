
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
import React, { useState} from 'react';
import { CarruselItem } from '@/app/interfaces/interfaces';
import { Fab } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const DeletCarrusel = React.forwardRef(function DeletCarrusel(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);
  const [carruselItems, setCarruselItems] = useState<CarruselItem[]>([]);




  const obtenerCarrusel = async () => {
    try {
      const response = await fetch('/api/Publicaciones/carrusel');
      if (!response.ok) {
        throw new Error('Error al obtener los items de carrusel: ' + response.statusText);
      }
      const data: CarruselItem[] = await response.json();
      setCarruselItems(data.length ? data : []);
    } catch (error) {
      console.error('Error al obtener los items de carrusel:', error);
    }
  };


  const handleDelete = (id: string) => {
    eliminarCarrusel(id);
  };
  const  eliminarCarrusel = async (id: string) => {
    try {
        const response = await fetch(`/api/Publicaciones/carrusel`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        const responseData = await response.json();
         if (response.ok) {
      setCarruselItems((prevItems) => prevItems.filter(item => item.id !== id));
    }
    return responseData;
} catch (error) {
    console.error('Error al eliminar la publicación:', error);
    throw error;
  }
};

  
  
const handleClickOpen = () => {
    setOpen(true);
    obtenerCarrusel();
  };

  const handleClose = () => {
    setOpen(false);
  };




  return (
    <React.Fragment>
  <Fab size="medium" color="secondary" aria-label="add">
  <DeleteSweepIcon  onClick={handleClickOpen}/>
  </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={DeletCarrusel}
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
              Borrar Banner
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Confirmar
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {carruselItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItemButton>
                <ListItemText primary={item.tituloprincipal} secondary={item.titulosecundario} />
                <Button onClick={() => handleDelete(item.id)} variant="contained" color="secondary">
                  Delete
                </Button>
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Dialog>
    </React.Fragment>
  );
}