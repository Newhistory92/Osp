import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import especialidadesData from '../../../../../especialidad.json'; 
import { Prestador, Especialidad } from '@/app/interfaces/interfaces';




interface FilterEspecialidadProps {
  prestadores: Prestador[];
  setFilteredData: React.Dispatch<React.SetStateAction<Prestador[]>>;
}

const FilterEspecialidad: React.FC<FilterEspecialidadProps> = ({ prestadores, setFilteredData }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedEspecialidad, setSelectedEspecialidad] = React.useState<Especialidad | null>(null);


  const filterByEspecialidad = (value: string) => {
    const filteredPrestadores = prestadores.filter(prestador =>
      prestador.especialidad.toLowerCase().includes(value.toLowerCase()) ||
      (prestador.especialidad2 && prestador.especialidad2.toLowerCase().includes(value.toLowerCase())) ||
      (prestador.especialidad3 && prestador.especialidad3.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredData(filteredPrestadores);
  };

  const handleOptionSelect = (selectedOption: Especialidad | null) => {
    setSelectedEspecialidad(selectedOption);
    if (selectedOption) {
      filterByEspecialidad(selectedOption.nombre);
    } else {
      setFilteredData(prestadores); 
    }
  };

  return (
    <Autocomplete
      id="especialidades-autocomplete"
      sx={{ width: 300 }}
      options={especialidadesData.especialidades}
      getOptionLabel={(option) => option.nombre}
      onChange={(event, newValue) => handleOptionSelect(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Busca por Especialidad"
          margin="normal"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const matches = match(option.nombre, searchQuery, { insideWords: true });
        const parts = parse(option.nombre, matches);

        return (
          <li {...props}>
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.highlight ? 700 : 400,
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        );
      }}
    />
  );
};

export default FilterEspecialidad;
