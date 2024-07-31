import Especialidades from "../../../../../especialidad.json";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from "react";



interface DialogSelectProps {
    onOk: (especialidad: string) => void;
  }
  export default function DialogSelect({ onOk }: DialogSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');

  const handleChange = (event: SelectChangeEvent<typeof selectedEspecialidad>) => {
    setSelectedEspecialidad(event.target.value as string);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (selectedEspecialidad) {
      onOk(selectedEspecialidad);
    }
  };
  

  return (
    <div>
      <Button onClick={handleClickOpen}>Agregar Especialidad</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Especialidad</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel id="demo-dialog-select-label">Nueva</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={selectedEspecialidad}
                onChange={handleChange}
                input={<OutlinedInput label="Nueva" />}
              >
                {Especialidades.especialidades.map((especialidad: { id: string; nombre: string; }, index: number) => (
                  <MenuItem key={especialidad.id} value={especialidad.nombre}>{especialidad.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
