"use client"
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import TypeAfiliado from '../../User1/afiliado/typeAfiliado';
import TypePrestador from '../../User2/prestador/typePrestador';
import TypeOperador from '../../User3/operador/typeOperador';
import Image from 'next/image';
import fondo from "../../../../public/fondo.jpeg"

const SelectUser = () => {
  const [selectedType, setSelectedType] = React.useState('');

  const handleTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedType(event.target.value);
  };


  return (
    <div className="relative w-screen h-screen">
      <Image
        src={fondo}
        alt="Fondo"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 flex justify-center items-center z-10 p-8">
        <div className="w-full max-w-lg p-8 bg-white bg-opacity-10 border border-white border-opacity-25 rounded-2xl shadow-lg backdrop-blur-lg">
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
          {selectedType === 'AFILIADO' && <TypeAfiliado />}
          {selectedType === 'PRESTADOR' && <TypePrestador />}
          {selectedType === 'OPERADOR' && <TypeOperador />}
          <p className="mt-4 text-sm text-gray-700">Por favor, seleccione el tipo de usuario para continuar.</p>
        </div>
      </div>
    </div>
  );
};

export default SelectUser;






//   return (
//     <div className="relative w-screen h-screen">
//       <Image
//         src={fondo}
//         alt="Fondo"
//         layout="fill"
//         objectFit="cover"
//       />
//       <div className="absolute top-0 left-0 right-0 flex justify-center">
//       <div className="w-80 max-w-screen-lg flex-col flex mx-auto p-8 bg-gray-800 bg-opacity-50 border-r-1 rounded shadow-lg">
//           {/* Contenido del formulario */}
//           <FormControl className="mt" variant="standard" sx={{ m: 1, minWidth: 150 }}>
//             <InputLabel className="text-white" id="user-type-label">Tipo de Usuario</InputLabel>
//             <Select
//               labelId="user-type-label"
//               id="user-type-select"
//               value={selectedType}
//               onChange={handleTypeChange}
//               label="Tipo de Usuario"
//               className="mt-3 border-t border-blue-gray-200 focus:border-t  focus:border-gray-900  w-full h-10"
//             >
//               <MenuItem value="">
//                 <em>Seleccionar...</em>
//               </MenuItem>
//               <MenuItem  value="AFILIADO">Afiliado</MenuItem>
//               <MenuItem value="PRESTADOR">Prestador</MenuItem>
//               <MenuItem value="OPERADOR">Operador</MenuItem>
//             </Select>
//           </FormControl>
//           {/* Condicionalmente renderizar componentes según el tipo seleccionado */}
//           {selectedType === 'AFILIADO' && <TypeAfiliado />}
//           {selectedType === 'PRESTADOR' && <TypePrestador />}
//           {selectedType === 'OPERADOR' && <TypeOperador />}
//         </div>
//       </div>
//     </div>
//   );
// };














































// "use client"
// import React, { useState } from 'react';
// import { Typography, Input, Button } from '@mui/material';
// import data from "../../../afiliados.json";
// import dataprest from "../../../prestor.json";
// import dataopera from "../../../operador.json";

// const SelectUser = () => {
//   const [selectedType, setSelectedType] = useState('');
//   const [inputValue, setInputValue] = useState('');
//   const [selectedUser, setSelectedUser] = useState<any>(null);;

//   const handleTypeChange = (type: string) => {
//     setSelectedType(type);
//     setInputValue('');
//     setSelectedUser(null);
//   };

//   const handleInputChange = (value: string) => {
//     // Limitar el input a solo números y una longitud máxima
//     let maxLength;
//     switch (selectedType) {
//       case 'AFILIADOS':
//         maxLength = 8;
//         break;
//       case 'OPERADORES':
//       case 'PRESTADORES':
//         maxLength = 5;
//         break;
//       default:
//         maxLength = 8; // Valor por defecto para otros tipos
//         break;
//     }
//     const sanitizedValue = value.replace(/\D/g, '').slice(0, maxLength);
//     setInputValue(sanitizedValue);

//     let user: any = {};
//     switch (selectedType) {
//       case 'AFILIADOS':
//         user = data.find(afiliado => afiliado.dni === sanitizedValue);
//         break;
//       case 'OPERADORES':
//         user = dataopera.find(operador => operador.operador === sanitizedValue);
//         break;
//         case 'PRESTADORES':
//           user = dataprest.find(prestador => prestador.matricula === sanitizedValue);
//           if (user) {
//             user.especialidad = user.especialidad;
//           }
//           break;
//       default:
//         break;
//     }
//     setSelectedUser(user);
//   };

//   const handleConfirmClick = async () => {
//     try {
//       let additionalFields = {};

//       switch (selectedType) {
//         case 'AFILIADOS':
//           additionalFields = { dni: inputValue };
//           break;
//         case 'OPERADORES':
//           additionalFields = { numeroOperario: inputValue };
//           break;
//           case 'PRESTADORES':
//             additionalFields = { 
//               numeroMatricula: selectedUser.matricula,
//               especialidad: selectedUser.especialidad 
//             };
//             break;
//         default:
//           break;
//       }
  
//       if (Object.keys(additionalFields).length === 0) {
//         console.error('Tipo de usuario no válido');
//         return;
//       }
//       console.log('Datos enviados:', additionalFields);
//       const getApiRoute = (selectedType: string) => {
//         switch (selectedType) {
//           case 'AFILIADOS':
//             return 'http://localhost:3000/api/handlerafiliado';
//           case 'OPERADORES':
//             return '/api/handleroperario';
//           case 'PRESTADORES':
//             return '/api/handlerprestador';
//           default:
//             throw new Error('Tipo de usuario no válido');
//         }
//       };

//       const userWithAdditionalFields = { ...selectedUser, ...additionalFields };

//       console.log('Enviando solicitud POST a:', getApiRoute(selectedType));
      
//       const response = await fetch(getApiRoute(selectedType), {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userWithAdditionalFields),
//          // Envía los datos del usuario seleccionado con los campos adicionales
//       });
//       console.log('Datos enviados al backend:', userWithAdditionalFields);
//       if (response.ok) {
//         // Si la solicitud fue exitosa, redirige al usuario a la página de dashboard correspondiente
//         switch (selectedType) {
//           // case 'AFILIADOS':
//           //   window.location.href = '/page/dashboard/afiliado';
//             // break;
//           case 'OPERADORES':
//             window.location.href = '/page/dashboard/operador';
//             break;
//           case 'PRESTADORES':
//             window.location.href = '/page/dashboard/prestador';
//             break;
//           default:
//             break;
//         }
//       } else {
//         console.error('Error al enviar datos a la API');
//       }
//     } catch (error) {
//       console.error('Error de red:', error);
//     }
//   };

//   return (
//     <div className="w-80 max-w-screen-lg mx-auto p-8 bg-white rounded-lg shadow-md">
//       <Typography className="text-lg item font-normal text-center">
//         Tipo de usuario
//       </Typography>
//       <select
//         className="mb-3 font-medium mt-5 border-t border-blue-gray-200 focus:border-t focus:border-gray-900"
//         onChange={(e) => handleTypeChange(e.target.value)}
//       >
//         <option value="">Seleccionar...</option>
//         <option value="AFILIADOS">Afiliado</option>
//         <option value="OPERADORES">Operador</option>
//         <option value="PRESTADORES">Prestador</option>
//       </select>

//       {selectedType && (
//         <div>
//           <label>
//             {`Ingrese ${
//               selectedType === "AFILIADOS"
//                 ? "DNI"
//                 : selectedType === "OPERADORES"
//                 ? "Número de operador"
//                 : "Número de matrícula"
//             }:`}
//           </label>
//           <Input
//             type="text"
//             value={inputValue}
//             onChange={(e) => handleInputChange(e.target.value)}
//             className="mt-2 border-t border-blue-gray-200 focus:border-t focus:border-gray-900"
//           />

//           {selectedUser && (
//             <div className="mt-4">
//              <Typography>Nombre: {selectedUser ? (selectedType === 'OPERADORES' ? selectedUser.name : selectedUser.name) : 'Nombre no encontrado'}</Typography>
//             <Typography>{selectedType === 'PRESTADORES' ? 'Especialidad' : (selectedType === 'OPERADORES' ? null : 'Dependencia')} {selectedUser ? (selectedType === 'PRESTADORES' ? selectedUser.especialidad : (selectedType === 'OPERADORES' ? null : selectedUser.dependencia)) : 'Información no disponible'}</Typography>


//               <Button
//                 className="mt-2"
//                 fullWidth
//                 onClick={handleConfirmClick}
//                 disabled={!inputValue || !selectedUser}
//               >
//                 Confirmar
//               </Button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SelectUser;

