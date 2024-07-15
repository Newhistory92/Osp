import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Prestador } from '@/app/interfaces/interfaces';



interface FilterUserProps {
  prestadores: Prestador[];
  setFilteredData: React.Dispatch<React.SetStateAction<Prestador[]>>;
}

const FilterUser: React.FC<FilterUserProps> = ({ prestadores, setFilteredData }) => {
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    const filtered = inputValue
      ? prestadores.filter((prestador) => {
          const name = prestador.name ? prestador.name.toLowerCase() : '';
          return name.includes(inputValue.toLowerCase());
        })
      : prestadores;

    setFilteredData(filtered);
  }, [inputValue, prestadores, setFilteredData]);
  return (
    <Box
      component="form"
      sx={{ width: 200 }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label="Buscar por Nombre o Apellido"
        variant="outlined"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onBlur={(event) => setInputValue(event.target.value)} 
      />
    </Box>
  );
};

export default FilterUser;
