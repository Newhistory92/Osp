"use client"
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import TypeAfiliado from '../../User1/afiliado/typeAfiliado';
import TypePrestador from '../../User2/prestador/typePrestador';
import TypeOperador from '../../User3/operador/typeOperador';
import "../../styles/selectUser.css"

const SelectUser = () => {
  const [selectedType, setSelectedType] = React.useState('');

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value);
  };

  const renderUserTypeComponent = () => {
    switch (selectedType) {
      case 'AFILIADO':
        return <TypeAfiliado />;
      case 'PRESTADOR':
        return <TypePrestador />;
      case 'OPERADOR':
        return <TypeOperador />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-orange-800">
      <div className="ripple-background">
        <div className="circle xxlarge shade1"></div>
        <div className="circle xlarge shade2"></div>
        <div className="circle large shade3"></div>
        <div className="circle medium shade4"></div>
        <div className="circle small shade5"></div>
      </div>
      <div className="absolute inset-0 flex justify-center items-center z-10 p-8">
        <div className="w-full max-w-lg p-8 bg-white bg-opacity-50 border border-white border-opacity-25 rounded-2xl shadow-lg backdrop-blur-lg">
          <FormControl variant="standard" className="w-full">
            <InputLabel className="text-gray-800" id="user-type-label">Tipo de Usuario</InputLabel>
            <Select
              labelId="user-type-label"
              id="user-type-select"
              value={selectedType}
              onChange={handleTypeChange}
              label="Tipo de Usuario"
              className="mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full h-10"
            >
              <MenuItem value="">
                <em>Seleccionar...</em>
              </MenuItem>
              <MenuItem value="AFILIADO">Afiliado</MenuItem>
              <MenuItem value="PRESTADOR">Prestador</MenuItem>
              <MenuItem value="OPERADOR">Operador</MenuItem>
            </Select>
          </FormControl>
          {renderUserTypeComponent()}
          <p className="mt-4 text-sm text-gray-700">Por favor, seleccione el tipo de usuario para continuar.</p>
        </div>
      </div>
    </div>
  );
};

export default SelectUser;
