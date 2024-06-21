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
  openModal: (prestador: Prestador) => void;
}

const FilterUser: React.FC<FilterUserProps> = ({ prestadores, openModal }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<PrestadorFilter[]>([]);

  const filterOptions = React.useCallback((value: string) => {
    const filtered = prestadores.filter((prestador) =>
      `${prestador.name} ${prestador.apellido}`.toLowerCase().includes(value.toLowerCase())
    );
    setOptions(filtered);
  }, [prestadores]);

  React.useEffect(() => {
    filterOptions(inputValue);
  }, [inputValue, filterOptions]);


  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const handleOpenModal = (prestadorFilter: PrestadorFilter) => {
    const prestador: Prestador = {
      ...prestadorFilter,
      imageUrl: '',       
      descripcion: '',  
      phone: '',          
      phoneOpc: '',      
      address: '',       
      especialidad: '',   
      especialidad2: '', 
      especialidad3: '', 
      tipo: '',
      email: '',         
      checkedPhone: false 
    };
    openModal(prestador);
  };

  return (
    <Autocomplete
      id="grouped-demo"
      options={options}
      groupBy={(option) => {
        const firstLetter = capitalizeFirstLetter(option.name[0]);
        return /[0-9]/.test(firstLetter) ? '0-9' : firstLetter;
      }}
      getOptionLabel={(option) => `${capitalizeFirstLetter(option.name)} ${capitalizeFirstLetter(option.apellido)}`}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Buscar por Nombre o Apellido" />}
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{capitalizeFirstLetter(params.group)}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
      onChange={(event, value) => {
        if (value) {
          handleOpenModal(value);
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
    />
  );
};

export default FilterUser;
