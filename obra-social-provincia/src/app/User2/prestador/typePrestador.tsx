"use client"
import React, { useState, useEffect } from 'react';
import { Typography, Input, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import prestadoresData from '../../../../prestor.json';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "../../hooks/StoreHook";
import { setCurrentUser, setLoading, setErrorMessage } from "../../redux/Slice/userSlice";

const TypePrestador = () => {
  const [matricula, setMatricula] = useState('');
  const dispatch = useAppDispatch();
  const { currentUser, loading, errorMessage } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(setLoading(true)); 

    const verifyUser = async () => {
      try {
        const response = await fetch('/api/handlerprestador', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();

        if (response.ok) {
          if (data.status === 200) {
            dispatch(setCurrentUser(data.user)); // Asegúrate de que data.user coincide con UserInfo
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
    setMatricula(sanitizedValue);
    const prestador = prestadoresData.find(prestador => prestador.matricula === sanitizedValue);
    if (prestador) {
      dispatch(setCurrentUser(prestador));
      dispatch(setErrorMessage(null));
    }
  };

  const handleConfirm = async () => {
    try {
      dispatch(setLoading(true));

      if (!currentUser) {
        toast.error('Seleccione un prestador antes de confirmar');
        dispatch(setLoading(false));
        return;
      }

      const response = await fetch('/api/handlerprestador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricula: currentUser.matricula, especialidad: currentUser.especialidad }),
      });

      const responseData = await response.json();

      if (responseData.status === 200) {
        dispatch(setCurrentUser(responseData.newPrestador));
        window.location.href = '/page/dashboard';
        toast.success(responseData.message);
      } else if (responseData.status === 400) {
        dispatch(setErrorMessage(responseData.message));
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error('Error al confirmar el prestador:', error);
      toast.error('Ocurrió un error al confirmar el prestador');
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }
  const handlePrev = () => {
    dispatch(setErrorMessage(null)); 
  };

 

  return (
    <div className=" max-w-screen-lg flex-col flex mx-auto p-8 bg-gray-700 rounded  shadow-md  px-4">
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
            <Button
              variant="contained"
              onClick={handlePrev}
              className="mt-2 ms-6"
              
            >
              Inicio
            </Button>
          )}</Link>
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
      <ToastContainer />
    </div>
  );
};

export default TypePrestador;

