"use client"
import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Alert } from '@mui/material';
import operadoresData from '../../../../operador.json';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "../../hooks/StoreHook";
import { setPartialCurrentUser,setCurrentUser, setLoading, setErrorMessage,setSuccessMessage } from "../../redux/Slice/userSlice";
import { PartialUserInfo } from '@/app/interfaces/interfaces';
import Loading from '@/app/components/Loading/loading';
const TypeOperador = () => {
  const [numeroOperador, setNumeroOperador] = useState<string>('');
  const dispatch = useAppDispatch();
  const { currentUser, loading, errorMessage,successMessage } = useAppSelector((state) => state.user);


  useEffect(() => {
    dispatch(setErrorMessage(null));
  }, [dispatch]);


  useEffect(() => {
    const verifyUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/Users/operador', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          if (data.status === 200) {
            dispatch(setPartialCurrentUser(data.user));
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
    setNumeroOperador(sanitizedValue);

    const operador = operadoresData.find(operador => operador.operador === sanitizedValue);
    if (operador) {
      const newCurrentUser: PartialUserInfo = {
        id: operador.id,
        name: operador.name,
        operador: operador.operador,
        matricula: '',
        especialidad: '',
        dni: '',
        dependencia: ''
      };

      dispatch(setPartialCurrentUser(newCurrentUser));
      dispatch(setErrorMessage(null));
    }
  };

  const handleConfirm = async () => {
    if (!currentUser) {
      dispatch(setErrorMessage('Seleccione un operador antes de confirmar'));
      return;
    }

    dispatch(setLoading(true));

    try {
      const response = await fetch('/api/Users/operador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       
      body: JSON.stringify({ numeroOperador: currentUser.operador }),
      });

      const responseData = await response.json();
      if (responseData.status === 200) {
        dispatch(setCurrentUser(responseData.newOperador));
        dispatch(setSuccessMessage('El Operador fue creado con éxito'));
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
      dispatch(setErrorMessage('Ocurrió un error al confirmar el Operador'));
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
      <Typography className="text-white" variant="h6">Tipo de usuario: Operador</Typography>
      <label className="text-white">Ingrese Número de Operador:</label>
      <Input
        type="text"
        value={numeroOperador}
        onChange={handleInputChange}
        className="mt-2 border-t border-blue-gray-200 focus:border-t focus:border-gray-900"
      />
      {currentUser && (
        <div className="mt-4">
          <Typography className="text-white">Nombre: {currentUser.name}</Typography>
          <Link href="/">
            {errorMessage === "400" && (
              <Button variant="contained" className="mt-2 ms-6">
                Inicio
              </Button>
            )}
          </Link>
          {!errorMessage && (
            <Button
              variant="contained"
              onClick={handleConfirm}
              className="mt-2 ms-6"
              disabled={loading}
            >
              Confirmar
            </Button>
          )}
        </div>
        )}
        <Alert severity="info">Por favor ingrese su N° de Operador para continuar.</Alert>
      </div>
      <div className='mt-12 relative'>
        {loading && <Loading />}
        </div>
    </div>
  );
};

export default TypeOperador;
