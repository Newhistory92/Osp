"use client"
import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Alert } from '@mui/material';
import operadoresData from '../../../../operador.json';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "../../hooks/StoreHook";
import { setPartialCurrentUser, setLoading, setErrorMessage } from "../../redux/Slice/userSlice";
import { PartialUserInfo } from '@/app/interfaces/interfaces';

const TypeOperador = () => {
  const [numeroOperador, setNumeroOperador] = useState<string>('');
  const dispatch = useAppDispatch();
  const { currentUser, loading, errorMessage } = useAppSelector((state) => state.user);

  useEffect(() => {
    const verifyUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/handleroperador', {
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
      const response = await fetch('/api/handleroperador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       
      body: JSON.stringify({ numeroOperador: currentUser.operador }),
      });

      const responseData = await response.json();

      if (responseData.status === 200) {
        dispatch(setPartialCurrentUser(responseData.newOperador));
        window.location.href = '/page/dashboard';
      } else {
        dispatch(setErrorMessage(responseData.message));
      }
    } catch (error) {
      console.error('Error al confirmar el operador:', error);
      dispatch(setErrorMessage('Ocurrió un error al confirmar el operador'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
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
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Alert severity="info">Por favor ingrese el número de operador para continuar.</Alert>
    </div>
  );
};

export default TypeOperador;
