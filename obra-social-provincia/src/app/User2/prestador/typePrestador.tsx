"use client"
import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Alert } from '@mui/material';
import prestadoresData from '../../../../prestor.json';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "../../hooks/StoreHook";
import { setPartialCurrentUser, setLoading, setErrorMessage } from "../../redux/Slice/userSlice";
import { PartialUserInfo, UserInfo } from '@/app/interfaces/interfaces';

// Componente principal para el tipo de usuario Prestador
const TypePrestador = () => {
  const [matricula, setMatricula] = useState<string>('');
  const dispatch = useAppDispatch();
  const { currentUser, loading, errorMessage } = useAppSelector((state) => state.user);

  // Verifica si el usuario está en la base de datos al cargar el componente
  useEffect(() => {
    const verifyUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/handlerprestador', {
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

  // Maneja el cambio de entrada en el input de matrícula
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value.replace(/\D/g, '').slice(0, 8);
    setMatricula(sanitizedValue);

    const prestador = prestadoresData.find(prestador => prestador.matricula === sanitizedValue);
    if (prestador) {
      const newCurrentUser: PartialUserInfo = {
        id: prestador.id,
        name: prestador.name,
        matricula: prestador.matricula,
        especialidad: prestador.especialidad,
        dni: '',
        dependencia: '',
        operador: ''
      };

      dispatch(setPartialCurrentUser(newCurrentUser));
      dispatch(setErrorMessage(null));
    }
  };

  // Confirma y envía los datos del prestador a la base de datos
  const handleConfirm = async () => {
    if (!currentUser) {
      dispatch(setErrorMessage('Seleccione un prestador antes de confirmar'));
      return;
    }

    dispatch(setLoading(true));

    try {
      const response = await fetch('/api/handlerprestador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula: currentUser.matricula,
          especialidad: currentUser.especialidad,
        }),
      });

      const responseData = await response.json();

      if (responseData.status === 200) {
        dispatch(setPartialCurrentUser(responseData.newPrestador));
        window.location.href = '/page/dashboard';
      } else {
        dispatch(setErrorMessage(responseData.message));
      }
    } catch (error) {
      console.error('Error al confirmar el prestador:', error);
      dispatch(setErrorMessage('Ocurrió un error al confirmar el prestador'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-screen-lg flex-col flex mx-auto p-8 bg-gray-700 rounded shadow-md px-4">
      <Typography className="text-white" variant="h6">Tipo de usuario: Prestador</Typography>
      <label className="text-white">Ingrese Nº de Matrícula:</label>
      <Input
        type="text"
        value={matricula}
        onChange={handleInputChange}
        className="mt-2 border-t border-blue-gray-200 focus:border-t focus:border-gray-900"
      />
      {currentUser && (
        <div className="mt-4">
          <Typography className="text-white">Nombre: {currentUser.name}</Typography>
          <Typography className="text-white">Especialidad: {currentUser.especialidad}</Typography>
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
      <Alert severity="info">Por favor ingrese su matrícula para continuar.</Alert>
    </div>
  );
};

export default TypePrestador;



