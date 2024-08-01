"use client"
import React, { useState, useEffect} from 'react';
import { Typography, Input, Button, Alert } from '@mui/material';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "../../hooks/StoreHook";
import { setPartialCurrentUser,setCurrentUser,  setErrorMessage,setSuccessMessage,clearCurrentUser } from "../../redux/Slice/userSlice";
import { PartialUserInfo } from '@/app/interfaces/interfaces';
import {setLoading} from '@/app/redux/Slice/loading';
import Loading from '@/app/components/Loading/loading';


const TypeOperador = () => {
  const [numeroOperador, setNumeroOperador] = useState<string>('');
  const [isoperadorValid, setIsoperadorValid] = useState(false);
  const dispatch = useAppDispatch();
  const { currentUser, errorMessage,successMessage } = useAppSelector((state) => state.user);
  const { loading} = useAppSelector((state) => state.loading);



  useEffect(() => {
    dispatch(setErrorMessage(null));
    dispatch(setSuccessMessage(null));
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
        //console.log (data)
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
    const sanitizedValue = event.target.value.replace(/\D/g, '').slice(0, 3);
    setNumeroOperador(sanitizedValue);
    setIsoperadorValid(sanitizedValue.length === 3);
  
    if (sanitizedValue.length !== 3) {
      dispatch(clearCurrentUser());
      dispatch(setLoading(false)); 
    }
  };
  
  useEffect(() => {
    if (numeroOperador.length === 3) {
      dispatch(setLoading(true));
      //console.log('Triggering API call with numeroOperador:', numeroOperador);
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/Datos/operador?numeroOperador=${numeroOperador}`);
          //console.log('API Response Status:', response.status);
            
          if (!response.ok) {
            throw new Error('Operador not found');
          }
          const operador = await response.json();
          //console.log(operador)
          if (operador.ANULADA === "1") {
            dispatch(setErrorMessage(`Operador  Bloqueado`));
            dispatch(clearCurrentUser());dispatch(clearCurrentUser());
            return;
          }
       
          const newCurrentUser: PartialUserInfo = {
            id: operador.id,
            name: operador.NOMBRE,
            operador: operador.CODIGO,
            matricula: '',
            especialidad: '',
            dni: '',
            dependencia: '',
            tipo: '',
            address: null,
            phone: null
          };
         //console.log(newCurrentUser)
          dispatch(setPartialCurrentUser(newCurrentUser));
          dispatch(setErrorMessage(null));
          setIsoperadorValid(true);

        } catch (error) {
      
          dispatch(setErrorMessage('Operador not found'))
          dispatch(clearCurrentUser());

        }finally {
          dispatch(setLoading(false));
        }
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [numeroOperador, dispatch]);
  
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
       
      body: JSON.stringify({ numeroOperador: currentUser.operador,name:currentUser.name }),
      });

      const responseData = await response.json();
     // console.log(responseData)
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
  const capitalizeWords = (str: string) => {
    return str ? str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()) : '';
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
         <Typography className="text-white">Nombre: {capitalizeWords(currentUser.name)}</Typography>
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
              disabled={!isoperadorValid || loading}
              color="success"
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
