"use client"
import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Alert } from '@mui/material';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "../../hooks/StoreHook";
import { setPartialCurrentUser,setCurrentUser, setErrorMessage,setSuccessMessage,clearCurrentUser } from "../../redux/Slice/userSlice";
import {setLoading} from '@/app/redux/Slice/loading';
import { PartialUserInfo } from '@/app/interfaces/interfaces';
import Loading from '@/app/components/Loading/loading';


const TypeAfiliado = () => {
  const [dni, setDni] = useState<string>('');
  const dispatch = useAppDispatch();
  const { currentUser, errorMessage,successMessage } = useAppSelector((state) => state.user);
  const { loading} = useAppSelector((state) => state.loading);
  const [isDniValid, setIsDniValid] = useState(false);

  useEffect(() => {
    dispatch(setErrorMessage(null));
    dispatch(setSuccessMessage(null));
  }, [dispatch]);


  useEffect(() => {
    dispatch(setLoading(true));
    const verifyUser = async () => {
      try {
        const response = await fetch('/api/Users/afiliado', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
          console.log(data)
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
    const sanitizedValue = event.target.value.replace(/\D/g, '').slice(0, 8);
    setDni(sanitizedValue);
    setIsDniValid(sanitizedValue.length === 8);
    if (sanitizedValue.length !== 8) {
      dispatch(clearCurrentUser());
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    if (dni.length === 8) {
        console.log('Triggering API call with numerodni:', dni);
        const timeoutId = setTimeout(async () => {
            try {
                const response = await fetch(`/api/Datos/afiliado?dni=${dni}`);
                console.log('API Response Status:', response.status);

                if (!response.ok) {
                    throw new Error('Prestador not found');
                }
                const afiliado = await response.json();
                console.log(afiliado);

                const capitalizeWords = (str: string) => {
                    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                };

                if (afiliado.Fechabaja !== '1900-01-01T00:00:00.000Z') {
                    dispatch(setErrorMessage(`Afiliado Dado de Baja por ${capitalizeWords(afiliado.razonBaja) || 'Sin razón específica'}`));
                    dispatch(clearCurrentUser());
                    return;
                }

                if (afiliado.CodBaja.trim() !== '') {
                    dispatch(setErrorMessage(`Afiliado Dado de Baja por ${capitalizeWords(afiliado.razonBaja) || 'Sin razón específica'}`));
                    dispatch(clearCurrentUser());
                    return;
                }

                const newCurrentUser: PartialUserInfo = {
                  id: afiliado.id,
                  name: capitalizeWords(afiliado.Nombre),
                  dni: afiliado.Codigo,
                  dependencia: capitalizeWords(afiliado.dependencia),
                  matricula: '',
                  especialidad: '',
                  operador: '',
                  tipo: '',
                  address: null,
                  phone: null
                };

                console.log(newCurrentUser);
                dispatch(setPartialCurrentUser(newCurrentUser));
                dispatch(setErrorMessage(null));
                setIsDniValid(true);
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
}, [dni, dispatch]);
   
  const handleConfirm = async () => {
    
    if (!currentUser) {
      dispatch(setErrorMessage('Seleccione un afiliado antes de confirmar'));
      return;
    }

    dispatch(setLoading(true));

    try {
      const response = await fetch('/api/Users/afiliado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dni: currentUser.dni,
          dependencia: currentUser.dependencia,
          name:currentUser.name
        }),
      });

      const responseData = await response.json();

      if (responseData.status === 200) {
        dispatch(setCurrentUser(responseData.newAfiliado));
        dispatch(setSuccessMessage('El Afiliado fue creado con éxito'));
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
      dispatch(setErrorMessage('Ocurrió un error al confirmar el Afiliado'));
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
    <div className="max-w-screen-lg flex-col flex mx-auto p-8 bg-gray-700 rounded shadow-md px-4">
      <Typography className="text-white" variant="h6">Tipo de usuario: Afiliado</Typography>
      <label className="text-white">Ingrese Nº de DNI:</label>
      <Input
        type="text"
        value={dni}
        onChange={handleInputChange}
        className="mt-2 border-t border-blue-gray-200 focus:border-t focus:border-gray-900"
      />
      {currentUser && (
        <div className="mt-4">
          <Typography className="text-white">Nombre: {currentUser.name}</Typography>
          <Typography className="text-white">Dependencia: {currentUser.dependencia}</Typography>
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
              disabled={!isDniValid || loading}
              color="success"
            >
              Confirmar
            </Button>
          )}
        </div>
    )}
    <Alert severity="info">Por favor ingrese su DNI para continuar.</Alert>
  </div>
  <div className='mt-12 relative'>
        {loading && <Loading />}
        </div>
</div>
);
};

export default TypeAfiliado;
