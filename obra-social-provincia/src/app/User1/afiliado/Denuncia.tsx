import React, { useState, FormEvent, useRef } from 'react';
import { Toast } from 'primereact/toast';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CancelIcon from '@mui/icons-material/Cancel';
import { DenunciaProps } from '@/app/interfaces/interfaces';
import { setLoading } from '@/app/redux/Slice/loading';
import { useAppDispatch } from '@/app/hooks/StoreHook';
import { addReportDenuncia } from '@/app/redux/Slice/denunciaSlice';
             
    const Denuncia: React.FC<DenunciaProps> = ({ closeModal, NombreEfector, EspecialidadEfector,  Efector,NombrePractica, FechaEfectua, onSuccess,IdFacturacion }) => {
    const [denuncia, setDenuncia] = useState('');
    const toast = useRef<Toast>(null);
    const dispatch = useAppDispatch()
 //console.log(IdFacturacion)
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (denuncia.trim() === '') {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debes completar el campo.' });
            return;
        }
        dispatch(setLoading(true));
        try {
            const response = await fetch('/api/Denuncias', {
                method: 'POST',
                body: JSON.stringify({ 
                    NombreEfector, 
                    EspecialidadEfector, 
                    NombrePractica, 
                    FechaEfectua, 
                    Efector,
                    denuncia 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Tu experiencia fue enviada.' });
                dispatch(addReportDenuncia(IdFacturacion)); 
                onSuccess();
           
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error, disculpa los inconvenientes.' });
            }
        } catch (error) {
            console.error('Error al realizar la operación POST:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error, disculpa los inconvenientes.' });
        }  finally {
            dispatch(setLoading(false));
          }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDenuncia(event.target.value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-auto max-w-lg mx-auto my-6">
            <div className="relative bg-white rounded shadow-lg outline-none focus:outline-none z-50">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">Cuéntanos tu Experiencia con el Prestador</p>
                </div>
                <div className="relative p-6 flex-auto">
                    <p> Tu opinion nos interesa y es totalmente anonima </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <textarea 
                                id="denuncia"
                                rows={8}
                                value={denuncia}
                                onChange={handleChange}
                                className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                                placeholder="Escribe tu experiencia..."
                                required 
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="rounded text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium text-sm px-2 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                                onClick={closeModal}
                            >
                                <CancelIcon className='mr-1' />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium text-sm px-3 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-3 mb-2"
                            >
                                Enviar
                                <ArrowForwardIcon className='ms-1' />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Toast ref={toast} position="bottom-center" />
        <div className="fixed inset-0 bg-black opacity-25"></div>
    </div>
);
};
export default Denuncia;