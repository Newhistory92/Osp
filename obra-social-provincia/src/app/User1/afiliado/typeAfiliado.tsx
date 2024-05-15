"use client"
import React, { useState, useEffect } from 'react';
import { Typography, Input, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import afiliadosData from '../../../../afiliados.json';
import Link from 'next/link';
import {useAppSelector,useAppDispatch} from "../../hooks/StoreHook"
import { setCurrentUser, setLoading, setErrorMessage } from "../../redux/Slice/userSlice"

const TypeAfiliado = () => {
  const [dni, setDni] = useState('');
  const dispatch = useAppDispatch();
  const { currentUser, loading, errorMessage } = useAppSelector((state) => state.user); // Asegúrate de que 'user' sea el nombre correcto del slice
console.log(currentUser, loading, errorMessage)

  useEffect(() => {
    dispatch(setLoading(true)); // Establecer carga en true al montar el componente

    const verifyUser = async () => {
      try {
        const response = await fetch('/api/handlerafiliado', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          if (data.status === 200) {
            // El usuario está en la tabla Afiliado, redirigir al dashboard de Afiliado
            dispatch(setCurrentUser(data.users)); // Establecer el usuario actual en el estado global
              window.location.href = '/page/dashboard';
            console.log('Estado global actualizado:', currentUser);
            console.log('redirige al /dashboard');
          } else if (data.status === 401) {
            // El usuario no está autenticado, redirigir al inicio de sesión
            window.location.href = '/page/signin';
          } else if (data.status === 402) {
            dispatch(setLoading(false)); // Establecer carga en false si el usuario no está en la tabla Afiliado
          }
        } else {
          dispatch(setLoading(false)); // Establecer carga en false si hay un error en la solicitud
        }
      } catch (error) {
        console.error('Error al verificar el usuario:', error);
        dispatch(setLoading(false)); // Establecer carga en false si hay un error en la solicitud
      }
    };

    verifyUser();
  }, []);

  const handleInputChange =  (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value.replace(/\D/g, '').slice(0, 8);
    setDni(sanitizedValue);
    const user = afiliadosData.find((afiliado) => afiliado.dni === sanitizedValue);
    dispatch(setCurrentUser(user)); // Establecer el usuario seleccionado en el estado global
    dispatch(setErrorMessage(null)); // Limpiar el mensaje de error
  };

  const handleConfirm = async () => {
    try {
      dispatch(setLoading(true));

      if (!currentUser) {
        toast.error('Seleccione un afiliado antes de confirmar');
        return;
      }

      const response = await fetch('/api/handlerafiliado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni:currentUser.dni, dependencia:currentUser.dependencia }),
      });

      const responseData = await response.json();
      console.log("respuesta del back",responseData)

      if (responseData.status === 200) {
        dispatch(setCurrentUser(responseData.newAfiliado));
        window.location.href = '/page/dashboard';
        toast.success(responseData.message);
      } else if (responseData.status === 400) {
        dispatch(setErrorMessage(responseData.status));
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error('Error al confirmar el afiliado:', error);
      toast.error('Ocurrió un error al confirmar el afiliado');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePrev = () => {
    dispatch(setErrorMessage(null)); // Limpiar el mensaje de error
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className=" max-w-screen-lg flex-col flex mx-auto p-8 bg-gray-700 rounded  shadow-md px-4">
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
            {errorMessage === "400" && (
              <Button variant="contained" onClick={handlePrev}  className="mt-2 ms-6">
                Inicio
              </Button>
            )}
          </Link>
          {!errorMessage && (
            <Button
             variant="contained" onClick={handleConfirm}  className="mt-2 ms-6" disabled={loading}>
              Confirmar
            </Button>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default TypeAfiliado;