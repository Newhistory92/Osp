import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/system';
import { PrestadorFilter, Prestador } from '@/app/interfaces/interfaces';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  left: '0',
  width: 'full',
  zIndex: '80',
  backgroundColor: '#fff',
  borderBottom: '1px solid #d1d5db',
  borderRadius: 'lg',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  overflowY: 'auto',
  maxHeight: '60',
  '&.dark': {
    backgroundColor: '#4b5563', 
    color: '#f3f4f6', 
    borderBottomColor: '#374151', 
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)', 
  },
}));
const GroupItems = styled('ul')({
  padding: 0,
});


interface FilterUserProps {
  prestadores: PrestadorFilter[];
  setFilteredData: React.Dispatch<React.SetStateAction<PrestadorFilter[]>>;
}

const FilterUser: React.FC<FilterUserProps> = ({ prestadores, setFilteredData }) => {
  const [inputValue, setInputValue] = React.useState('');

  const options = prestadores.map((prestador) => {
    const firstLetter = (prestador.name[0] || prestador.apellido[0]).toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...prestador,
    };
  });

  React.useEffect(() => {
    const filtered = prestadores.filter((prestador) =>
      `${prestador.name || ''} ${prestador.apellido || ''}`
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );
    setFilteredData(filtered);
  }, [inputValue, prestadores, setFilteredData]);

  return (
    <Autocomplete
      id="grouped-demo"
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => `${option.name} ${option.apellido}`}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Buscar por Nombre o Apellido"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      )}
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
    />
  );
};

export default FilterUser;
