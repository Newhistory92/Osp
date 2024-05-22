import React, { useState, FormEvent } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CancelIcon from '@mui/icons-material/Cancel';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { styled } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
interface DenunciaProps {
    closeModal: () => void;
}

const Denuncia: React.FC<DenunciaProps> = ({ closeModal }) => {
    const [denuncia, setDenuncia] = useState('');
    const [ratingValue, setRatingValue] = useState<number | null>(3); // Valor inicial para el Rating
    const [isSuccessToastVisible, setIsSuccessToastVisible] = useState(false);
    const [isWarningToastVisible, setIsWarningToastVisible] = useState(false);
    const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (denuncia.trim() === '') {
            setIsSuccessToastVisible(false);
            setIsWarningToastVisible(true);
            setIsErrorToastVisible(false);
            setTimeout(() => {
                setIsWarningToastVisible(false);
            }, 1000);
            return;
        }

        // Simulación de la operación PUT
        try {
            const response = await fetch('api/handlerafiliado', {
                method: 'PUT',
                body: JSON.stringify({ denuncia }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setIsSuccessToastVisible(true);
                setIsWarningToastVisible(false);
                setIsErrorToastVisible(false);
                setTimeout(() => {
                    setIsSuccessToastVisible(false);
                }, 1000);
            } else {
                setIsSuccessToastVisible(false);
                setIsWarningToastVisible(false);
                setIsErrorToastVisible(true);
                setTimeout(() => {
                    setIsErrorToastVisible(false);
                }, 1000);
            }
        } catch (error) {
            console.error('Error al realizar la operación PUT:', error);
            setIsSuccessToastVisible(false);
            setIsWarningToastVisible(false);
            setIsErrorToastVisible(true);
            setTimeout(() => {
                setIsErrorToastVisible(false);
            }, 1000);
        }
    };





    
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDenuncia(event.target.value);
    };

    const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
            color: theme.palette.action.disabled,
        },
    }));

    const customIcons: {
        [index: string]: {
            icon: React.ReactElement;
            label: string;
        };
    } = {
        1: {
            icon: <SentimentVeryDissatisfiedIcon color="error" />,
            label: 'Very Dissatisfied',
        },
        2: {
            icon: <SentimentDissatisfiedIcon color="error" />,
            label: 'Dissatisfied',
        },
        3: {
            icon: <SentimentSatisfiedIcon color="warning" />,
            label: 'Neutral',
        },
        4: {
            icon: <SentimentSatisfiedAltIcon color="success" />,
            label: 'Satisfied',
        },
        5: {
            icon: <SentimentVerySatisfiedIcon color="success" />,
            label: 'Very Satisfied',
        },
    };

    function IconContainer(props: IconContainerProps) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    return (
        
        <div>
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="relative w-auto max-w-lg mx-auto my-6">
                    {/* Contenido del modal */}
                    <div className="relative bg-white rounded shadow-lg outline-none focus:outline-none">
                        {/* Cabecera del modal */}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <blockquote>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">Cuentanos tu Experiencia con el Prestador</p>
                                <div >
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Valoración</label>
                                    <StyledRating
                                        name="rating"
                                        defaultValue={3}
                                        IconContainerComponent={IconContainer}
                                        getLabelText={(value: number) => customIcons[value].label}
                                        value={ratingValue}
                                        onChange={(event, newValue) => {
                                            setRatingValue(newValue);
                                        }}
                                        />
                                </div>
                            </blockquote>
                        </div>
                        {/* Cuerpo del modal */}
                        <div className="relative p-6 flex-auto">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                <form onSubmit={handleSubmit}>
            <div className="w-full mb-4 border border-gray-200 rounded bg-gray-50 dark:bg-gray-600 dark:border-gray-600">
                <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-800">
                    <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <AttachFileIcon fontSize="small"/>
                                <span className="sr-only">Adjuntar archivo</span>
                            </button>
                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <InsertPhotoIcon fontSize="small"/>
                                <span className="sr-only">Cargar imagen</span>
                            </button>
                        </div>
                    </div>
                </div>
                      <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                            <textarea id="denuncia" 
                            rows={8}  
                            value={denuncia}
                            onChange={handleChange}
                            className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" 
                            placeholder="Escribe tu Experiencia..."
                            required />
                                  </div>
                                </div>
                                </form>
                                </div>
                                <div className="flex justify-end">
                                    <button
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
                              {/* Toasts */}
            {isSuccessToastVisible && (
                <div id="toast-simple" className="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-lg dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" 
                 role="alert">
                    <SendRoundedIcon className="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45"/>
                    <div className="ps-4 text-sm font-normal">Tu Experiencia fue Enviada</div>
                </div>
            )}
            {isWarningToastVisible && (
                <div id="toast-warning" className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800" role="alert">
                    <div className="inline-flex  items-center rounded justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100  dark:bg-orange-700 dark:text-orange-200">
                    <ErrorOutlineRoundedIcon/>
                        <span className="sr-only">Warning icon</span>
                    </div>
                    <div className="ms-3 text-sm font-normal">Debes Completar el Campo !</div>
                </div>
            )}
            {isErrorToastVisible && (
                <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded shadow-lg dark:text-gray-400 dark:bg-gray-800" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                       <ReportGmailerrorredRoundedIcon/>
                        <span className="sr-only">Error icon</span>
                    </div>
                    <div className="ms-3 text-sm font-normal">Ocurrio un Error, Disculpa los Inconvenientes.</div>
                </div>
            )}
        
    
                        </div>
                    </div>
                </div>
            </div>
            {/* Fondo del modal */}
            <div className="fixed inset-0 bg-black opacity-25"></div>
        </div>
    );
};

export default Denuncia;

