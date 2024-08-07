"use client"
import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Alert } from '@mui/material';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "../../hooks/StoreHook";
import { setPartialCurrentUser, setCurrentUser, setErrorMessage,setSuccessMessage,clearCurrentUser  } from "../../redux/Slice/userSlice";
import { PartialUserInfo } from '@/app/interfaces/interfaces';
import Loading from '@/app/components/Loading/loading';
import {setLoading} from '@/app/redux/Slice/loading';
// Componente principal para el tipo de usuario Prestador
const TypePrestador = () => {
  const [matricula, setMatricula] = useState<string>('');
  const [ismatriculaValid, setIsmatriculaValid] = useState(false);
  const dispatch = useAppDispatch();
  const { currentUser, errorMessage,successMessage } = useAppSelector((state) => state.user);
  const { loading} = useAppSelector((state) => state.loading);

 // console.log("currentUser", currentUser)

  useEffect(() => {
    dispatch(setErrorMessage(null));
    dispatch(setSuccessMessage(null));
  }, [dispatch]);

  // Verifica si el usuario está en la base de datos al cargar el componente
  useEffect(() => {
    const verifyUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/Users/prestador', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
         // console.log(data)
        if (response.ok) {
          if (data.status === 200) {
            dispatch(setCurrentUser(data.users[0]));
            window.location.href = '/page/dashboard';
          } else if (data.status === 401) {
            window.location.href = '/page/signin';
          } else if (data.status === 402) {
            dispatch(setLoading(false));
          }
        } else {
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error('Error al verificar el usuario:', error);
        dispatch(setLoading(false));
      }
    };

    verifyUser();
  }, [dispatch]);

 
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value.replace(/\D/g, '').slice(0, 4);
    setMatricula(sanitizedValue);
    setIsmatriculaValid(sanitizedValue.length === 4);
    if (sanitizedValue.length !== 4) {
      dispatch(clearCurrentUser());
    }
  
  };

  useEffect(() => {
    dispatch(setLoading(true));
    if (matricula.length === 4) {
      //console.log('Triggering API call with numeroMatricula:', matricula);
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/Datos/prestador?matricula=${matricula}`);
          //console.log('API Response Status:', response.status);
          //console.log( response)
          if (!response.ok) {
            throw new Error('Prestador not found');
          }
          const prestador = await response.json();
         // console.log(prestador)
          
          const capitalizeWords = (str:string) => {
            return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
          };


          if (prestador.Anulada === 1) {
            dispatch(setErrorMessage(`Prestador dado de Baja`));
            dispatch(clearCurrentUser());
            return;
          }
  
          const fechaBaja = new Date(prestador.Fecha_Baja);
          const fechaActual = new Date();
          if (fechaBaja.getTime() !== new Date('1900-01-01T00:00:00.000Z').getTime() && fechaBaja < fechaActual) {
            dispatch(setErrorMessage(`Prestador dado de baja (Fecha de baja: ${fechaBaja.toISOString().split('T')[0]})`));
            dispatch(clearCurrentUser());
            return;
          }
          const address = `${prestador.Domicilio},${prestador.Localidad}`;
          //console.log(address)
          const tipo = (prestador.Fidelizado === "0" || prestador.Fidelizado === null) ? "No Fidelizado" : "Fidelizado";
          //console.log(prestador.Telefono)

          const newCurrentUser: PartialUserInfo = {
            id: prestador.id,
            name: capitalizeWords(prestador.Nombre),
            matricula: prestador.Codigo,
            especialidad: capitalizeWords(prestador.especialidad),
            tipo:tipo,
            address:capitalizeWords(address),
            phone:prestador.Telefono,
            dni: '',
            dependencia: '',
            operador: ''
          };
          //console.log( newCurrentUser)
          dispatch(setPartialCurrentUser(newCurrentUser));
          dispatch(setErrorMessage(null));
          setIsmatriculaValid(true);
        } catch (error) {
          dispatch(setErrorMessage('Prestador not found'));
          dispatch(clearCurrentUser());
        } finally {
          dispatch(setLoading(false));
        }
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      dispatch(setLoading(false));
    }
  }, [matricula, dispatch]);

  
  // Confirma y envía los datos del prestador a la base de datos
  const handleConfirm = async () => {
    if (!currentUser) {
      dispatch(setErrorMessage('Seleccione un prestador antes de confirmar'));
      return;
    }
       
  
    dispatch(setLoading(true));

    try {
      const response = await fetch('/api/Users/prestador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula: currentUser.matricula,
          especialidad: currentUser.especialidad,
          address: currentUser.address,
          tipo: currentUser.tipo,
          phoneOpc:currentUser.phone,
          name:currentUser.name
        }),
      });

      const responseData = await response.json();
     //console.log("respuesta del back",responseData)
      if (responseData.status === 200) {
        dispatch(setCurrentUser(responseData.newPrestador));
        dispatch(setSuccessMessage('El prestador fue creado con éxito'));
        dispatch(setErrorMessage(null));
        window.location.href = '/page/dashboard';
      } else if (responseData.status === 400) {
        dispatch(setErrorMessage('Error al crear la cuenta'));
        dispatch(setSuccessMessage(null));
      } else {
        dispatch(setErrorMessage(responseData.message));
        dispatch(setSuccessMessage(null));
      }
    } catch (error) {
      dispatch(setErrorMessage('Ocurrió un error al confirmar el prestador'));
      dispatch(setSuccessMessage(null));
    } finally {
      dispatch(setLoading(false));
    }
  };
 
  return (
    <div>
      {successMessage && (
        <Alert severity="success" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
          {errorMessage}
        </Alert>
      )}
      <div className="max-w-screen-lg flex-col flex mx-auto p-8 bg-gray-700 rounded shadow-md px-4 ">
        <Typography className="text-white" variant="h6">Tipo de usuario: Prestador</Typography>
        <label className="text-white">Ingrese Nº de Matrícula o codigo:</label>
        <Input
          type="text"
          value={matricula}
          onChange={handleInputChange}
           disabled={loading}
          className="mt-2 border-t border-blue-gray-200 focus:border-t focus:border-gray-900 "
        />
        {matricula && currentUser && (
          <div className="mt-4">
            <Typography className="text-white">Nombre: {currentUser.name}</Typography>
            <Typography className="text-white">Especialidad: {currentUser.especialidad}</Typography>
            <Link href="/">
              {errorMessage === "400" || errorMessage &&  (
              <Button variant="contained" className="mt-2 ms-6 mb-5" color="error">
                Volver al Inicio
              </Button>
            )}
            </Link>
            {!errorMessage && (
            <Button
              variant="contained"
              onClick={handleConfirm}
              className="mt-2 ms-6 mb-5"
              disabled={!ismatriculaValid || loading}
              color="success"
            >
              Confirmar
            </Button>
          )}
          </div>
          
        )}
        <Alert severity="info">Por favor ingrese su matrícula  o codigo de 4 digitos para continuar.</Alert>
         
      </div>
        <div className='mt-12 relative'>
        {loading && <Loading />}
        </div>
    </div>
  );
};

export default TypePrestador;