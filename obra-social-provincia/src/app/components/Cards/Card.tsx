import { Card, CardBody, CardFooter, Typography, Button, Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem} from "@material-tailwind/react";
  
import { useCountries } from "use-react-countries";
import axios from 'axios';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import SwichtStyle from "./SubComponentes/Switchstyle";
import React, { useRef } from 'react';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import DialogSelect from './SubComponentes/DialogSelect';
import MapComponent from "./SubComponentes/MapComponent"
import  {getFormattedAddress} from "./SubComponentes/Maps/MapApi"
import { setCurrentUser, setLoading} from "../../redux/Slice/userSlice";
import { useAppDispatch } from "../../hooks/StoreHook";
import Description from "../Perfil/Description";
import { Toast } from 'primereact/toast';
import { UserCardProps,  Country} from "@/app/interfaces/interfaces";
import Image from 'next/image';


import "primereact/resources/themes/lara-light-cyan/theme.css";

const UserCard: React.FC<UserCardProps> = ({
  id,
  role,
  dependencia,
  dni,
  phone,
  phoneOpc,
  matricula,
  especialidad,
  especialidad2,
  especialidad3,
  descripcion,
  tipo,
  numeroOperador,
  address,
  checkedPhone,
}) => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);
  const [especialidad2Seleccionada, setEspecialidad2Seleccionada] = React.useState<string | null>(null);
  const [especialidad3Seleccionada, setEspecialidad3Seleccionada] = React.useState<string | null>(null);
  const [fromModalOpen, setFromModalOpen] =  React.useState(false);
  const [from, setFrom] = React.useState<string | null>(null);
  const [ciudadOrigen, setCiudadOrigen] =  React.useState<string | null>(null);
  const [paisOrigen, setPaisOrigen] =  React.useState<string | null>(null);
  const [addressInfo, setAddressInfo] = React.useState<{ address: string | null, coordinates: google.maps.LatLngLiteral | null }>({ address: null, coordinates: null });
  const [hasChanges, setHasChanges] = React.useState(false);
  const { countries } = useCountries();
  const [country, setCountry] = React.useState<number>(167);
  const { name, flags, countryCallingCode } = countries[country];
const [checked, setChecked] = React.useState( checkedPhone);
const [telefonoPublico, setTelefonoPublico] = React.useState<string | null>(null);
const [description, setDescription] =React.useState<string | null>(null);
const [currentAddress, setCurrentAddress] = React.useState<string | null>(address ?? null); 



const handleConfirmChanges = async () => {
  dispatch(setLoading(true));
  try {
    const postData = {
      id,
      especialidad2Seleccionada,
      especialidad3Seleccionada,
      from,
      ciudadOrigen,
      paisOrigen,
      addressInfo,
      telefonoPublico,
      checked,
      description,
    };

    const response = await axios.put('/api/Users/prestador', postData);

    if (response.status === 200) {
      dispatch(setCurrentUser(response.data.updatedPrestador));
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Datos confirmados con éxito', life: 3000 });
      setHasChanges(false);
    } else {
      dispatch(setLoading(false));
    }
  } catch (error) {
    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un problema, inténtalo nuevamente en unos minutos', life: 3000 });
    dispatch(setLoading(false));
  }
};


  const handleEspecialidadSelect = (especialidad: string) => {
    console.log("Especialidad seleccionada:", especialidad);
    if (especialidad2Seleccionada === null) {
        setEspecialidad2Seleccionada(especialidad);
        setHasChanges(true)
    } else if (especialidad3Seleccionada === null) {
        setEspecialidad3Seleccionada(especialidad);
        setHasChanges(true)
    }
};

const handleChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
  setChecked(event.target.checked);
  setHasChanges(true)
};

const fromHandler = () => {
  setFromModalOpen(true);
};
const closeModal = async (fromSelected: google.maps.LatLngLiteral) => {
  setFromModalOpen(false);
  const locationInfo = await getFormattedAddress(fromSelected);

  if (typeof locationInfo === 'string') {
    console.error("Error al obtener la dirección:", locationInfo);
    // Manejar el error
  } else {
    setAddressInfo({ address: locationInfo.results, coordinates: locationInfo.coordinates });
    const fromArray = locationInfo.results.split(',');
    const extractCity = (str: string) => str.replace(/[\d\s\W]+/g, '').trim();
    const city = extractCity(fromArray[1]);
    setCiudadOrigen(city);
    setPaisOrigen(fromArray[fromArray.length - 1]);
    setFrom(fromArray[0]);
    setCurrentAddress(`${fromArray[0]} ${city} ${fromArray[fromArray.length - 1]}`); 
    setHasChanges(true)
  }
};

const closeMapModal = () => {
  setFromModalOpen(false);

};




const handleTelefonoPublicoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = `${countryCallingCode}${event.target.value}`;
  setTelefonoPublico(value);
  setHasChanges(true);
  console.log('Número con código de país:', value);
};

const handleCancelChanges = () => {
  setEspecialidad2Seleccionada(null);
  setEspecialidad3Seleccionada(null);
  setHasChanges(false);
};
const handleDescriptionSave = (newDescription: string) => {
  setDescription(newDescription);
  setHasChanges(true);
};


return (
  <>
    <Card className="mt-6 w-full md:w-96">
      <CardBody>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {role === "PROVIDER" && (
            <div>
              <Typography variant="h3" color="blue-gray" textGradient className="mb-2">
                Descripción
              </Typography>
              <Description initialDescription={descripcion || ''} onSave={handleDescriptionSave} />
              {description && (
                <Typography variant="h6">{description}</Typography>
              )}
            </div>
          )}
          <div>
            {role === "PROVIDER" && (
              <>
                <Typography variant="h4" color="blue-gray" className="mb-2">
                  Información del Prestador
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Typography><AssignmentIndIcon/>Matrícula: {matricula}</Typography>
                    <FormGroup>
                      <Typography><AddIcCallIcon/>Telefono: {phone}</Typography>
                      <FormControlLabel 
                        required 
                        control={<SwichtStyle checked={checked} onChange={handleChangePhone} />}   
                        label="Publicar Telefono"
                      />
                    </FormGroup>
                    <Typography><PhoneAndroidIcon/>Telefono Publico: {phoneOpc}</Typography>
                    <div className="relative flex w-full max-w-[24rem] md:max-w-none">
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <Button
                            ripple={false}
                            variant="text"
                            color="blue-gray"
                            className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                          >
                            <Image
                              src={flags.svg}
                              alt={name}
                              className="h-4 w-4 rounded-full object-cover"
                            />
                            {countryCallingCode}
                          </Button>
                        </MenuHandler>
                        <MenuList className="max-h-[20rem] max-w-[18rem]">
                          {countries.map(({ name, flags, countryCallingCode }: Country, index: number) => (
                            <MenuItem
                              key={name}
                              value={name}
                              className="flex items-center gap-2"
                              onClick={() => setCountry(index)}
                            >
                              <Image
                                src={flags.svg}
                                alt={name}
                                className="h-5 w-5 rounded-full object-cover"
                              />
                              {name} <span className="ml-auto">{countryCallingCode}</span>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                      <Input
                        type="tel"
                        placeholder="Mobile Number"
                        className="rounded-l-none flex-grow border-t-blue-gray-200 focus:border-t-gray-900"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                        containerProps={{
                          className: "min-w-0",
                        }}
                        onChange={handleTelefonoPublicoChange}
                        crossOrigin={undefined}
                      />
                    </div>
                    <Typography><MedicalInformationIcon/>Especialidad: {especialidad}</Typography>
                    <Typography><MedicalInformationIcon/>Especialidad: {especialidad2}</Typography>
                    <Typography>
                      <DialogSelect onOk={(especialidad: string) => handleEspecialidadSelect(especialidad)} />
                      {especialidad2Seleccionada} <button><DeleteOutlinedIcon onClick={handleCancelChanges} /></button>
                    </Typography>
                    <Typography><MedicalInformationIcon/>Especialidad: {especialidad3}</Typography>
                    <Typography>
                      <DialogSelect onOk={(especialidad: string) => handleEspecialidadSelect(especialidad)} />
                      {especialidad3Seleccionada} <button><DeleteOutlinedIcon onClick={handleCancelChanges} /></button>
                    </Typography>
                    <Typography><CheckCircleIcon />Estado: {tipo}</Typography>
                  </div>
                </div>
                <Typography><PlaceIcon />Dirección: {currentAddress}</Typography>

                <div className="mt-5">
                  <button className="rounded text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium text-sm px-2 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                    onClick={fromHandler}> 
                    <EditLocationAltIcon className="mr-1"/>Seleccionar dirección
                  </button>
                  {fromModalOpen && (
                    <div>
                      <MapComponent closeMapModal={closeMapModal} closeModal={closeModal} />
                    </div>
                  )}
                </div>
              </>
            )}
            {role !== "PROVIDER" && (
              <div>
                {role === "USER" && (
                  <>
                    <Typography variant="h3" color="blue-gray" className="mb-2">
                      Información de Usuario
                    </Typography>
                    <Typography><LocationCityIcon className="mr-1"/>Dependencia: {dependencia}</Typography>
                    <Typography><RecentActorsIcon className="mr-1"/>DNI: {dni}</Typography>
                    <Typography><AddIcCallIcon className="mr-1"/>Phone: {phone}</Typography>
                    <Typography><PlaceIcon />Dirección: {currentAddress}</Typography>
                    <div className="mt-5">
                      <button className="rounded text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium text-sm px-2 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                        onClick={fromHandler}> 
                        <EditLocationAltIcon className="mr-1"/>Seleccionar dirección
                      </button>
                      {fromModalOpen && (
                        <div>
                          <MapComponent closeMapModal={closeMapModal} closeModal={closeModal} />
                        </div>
                      )}
                    </div>
                  </>
                )}
                {role === "employee" && (
                  <>
                    <Typography variant="h3" color="blue-gray" className="mb-2">
                      Información de Empleado
                    </Typography>
                    <Typography>Phone: {phone}</Typography>
                    <Typography>Número Operador: {numeroOperador}</Typography>
                    <Typography><PlaceIcon />Dirección: {currentAddress}</Typography>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          className={hasChanges ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 hover:bg-gray-500"}
          onClick={handleConfirmChanges}
          disabled={!hasChanges}
        >Confirmar Cambios</Button>
      </CardFooter>
    </Card>
    <div className="card flex justify-content-center">
            <Toast ref={toast} position="bottom-center"/>
            
        </div>
  </>
);
};




export default UserCard;

