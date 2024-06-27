

import React, { useState, useEffect,useCallback, useMemo} from "react";
import "./Styles/buttomAvatar.css"
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';
import AddTaskSharpIcon from '@mui/icons-material/AddTaskSharp';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import PrestadorCard from './CardsPrestador';
import FilterUser from "./Filtros/UseAutocomplete";
import PaginationButtons from "../../components/Pagination/Pagination";
import FilterEspecialidad from "./Filtros/FilterEspecialidad";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
} from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";
import { Prestador } from "@/app/interfaces/interfaces";
import { Virtuoso } from 'react-virtuoso';

const TABS = [
  {
    label: "Todos",
    value: "Todos",
  },
  {
    label: "Fidelizado",
    value: "Fidelizado",
  },
  {
    label: "No Fidelizado",
    value: "No Fidelizado",
  },
];

const TABLE_HEAD = ["Prestador", "Especialidad", "Teléfono", "Direccion", "Tipo"];
 


const Prestadores = () => {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [filteredData, setFilteredData] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedPrestador, setSelectedPrestador] = useState<Prestador | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const perPage = 8;
  
  



  const fetchPrestadores = useCallback(async () => {
    try {
      const url = '/api/Datos/prestador';
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = await response.json();
      if (Array.isArray(responseData)) {
        setPrestadoresAndLoading(responseData, false);
      } else {
        console.error('La respuesta de la API no es un arreglo:', responseData);
      }
    } catch (error) {
      console.error('Error al obtener los prestadores:', error);
      setLoading(false);
    }
  }, []);
  
  const setPrestadoresAndLoading = (prestadoresData: Prestador[], isLoading: boolean) => {
    setPrestadores(prestadoresData);
    setFilteredData(prestadoresData);
    setLoading(isLoading);
  };


  useEffect(() => {
    fetchPrestadores();
  }, [fetchPrestadores]);


  useEffect(() => {
    const totalPages = Math.ceil(prestadores.length / perPage);
    if (totalPages === 0 || page > totalPages) {
      setPage(totalPages);
      return;
    }
    setLoading(false);
  }, [prestadores, page, perPage]);
;

  
useEffect(() => {
  const filterPrestadores = () => {
    if (selectedType === 'Todos') {
      setFilteredData(prestadores);
    } else {
      const filtered = prestadores.filter((prestador) => prestador.tipo === selectedType);
      setFilteredData(filtered);
    }
  };

  filterPrestadores();
}, [selectedType, prestadores]);




  //const maxPage = Math.ceil(selectedType === "Todos" ? prestadores.length : filteredData.length / perPage);
  const maxPage = useMemo(() => Math.ceil(filteredData.length / perPage), [filteredData.length, perPage]);

  const handleTabChange = useCallback((selectedType: string) => {
    setSelectedType(selectedType);
    const filtered = prestadores.filter((prestador) => {
      if (selectedType === 'Todos') {
        return true;
      } else if (selectedType === 'Fidelizado') {
        return prestador.tipo.toLowerCase().includes('fidelizado');
      } else if (selectedType === 'No Fidelizado') {
        return prestador.tipo.toLowerCase().includes('no_fidelizado');
      } else {
        return prestador.tipo.toLowerCase() === selectedType.toLowerCase();
      }
    });
    setFilteredData(filtered);
    setPage(1);
  }, [prestadores]);
  
  
 
  const handleAvatarButtonClick = (prestador: React.SetStateAction<Prestador | null>) => {
    setSelectedPrestador(prestador);
    onOpen();
  };
  const openModal = (prestador: Prestador) => {
    setSelectedPrestador(prestador);
    onOpen();
  };
 

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de Prestadores
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Informacion
            </Typography>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
  
          <div className="flex flex-col items-center w-full md:flex-row md:w-auto gap-4 ">
            <div className="w-full flex-grow">
              <FilterUser prestadores={prestadores} openModal={openModal} />
            </div>
            <div className="w-full flex-grow mb-2">
              <FilterEspecialidad prestadores={prestadores} setFilteredData={setFilteredData} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className=" px-0">
        {loading ? (
          <Skeleton height={400} count={8} />
        ) : (
          <>
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
            <div className="h-full overflow-auto">
              <Virtuoso
                data={filteredData}
                itemContent={(index, prestador) => {
                  const { id, name, apellido, imageUrl, phone, phoneOpc, especialidad, address, tipo, checkedPhone, especialidad2, especialidad3 } = prestador;
                  const isLast = index === filteredData.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
  
                  return (
                    <tr key={id} className="flex flex-wrap md:flex-nowrap ">
                      <td className={`${classes} flex-grow md:w-1/5`}>
                        <div className="flex items-center gap-3 ">
                          <button className="avatar-button" onClick={() => handleAvatarButtonClick(prestador)}>
                            <Avatar src={imageUrl} alt={apellido} size="sm" />
                          </button>
                          <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {name} {apellido}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={`${classes} flex-grow md:w-1/5`}>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            <td className="align-middle">
                              <MedicalInformationOutlinedIcon className="mr-2 mb-1" />
                              {especialidad} <ChevronRightOutlinedIcon fontSize="small" />
                              {especialidad2}
                              <ChevronRightOutlinedIcon fontSize="small" />
                              {especialidad3}
                            </td>
                          </Typography>
                        </div>
                      </td>
                      <td className={`${classes} flex-grow md:w-1/5`}>
                        <div className="w-max">
                          <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                            <td className="align-middle">
                              {checkedPhone && (
                                <>
                                  <LocalPhoneOutlinedIcon className="mr-2" />
                                  {phone}
                                  <ChevronRightOutlinedIcon fontSize="small" />
                                </>
                              )}
                              {phoneOpc && (
                                <>
                                  <LocalPhoneOutlinedIcon className="mr-2" /> {phoneOpc}
                                </>
                              )}
                            </td>
                          </Typography>
                        </div>
                      </td>
                      <td className={`${classes} flex-grow md:w-1/5`}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <td className="align-middle">
                            <AddLocationOutlinedIcon className="mr-2 mb-1" />
                            {address}
                          </td>
                        </Typography>
                      </td>
                      <td className={`${classes} flex-grow md:w-1/5`}>
                        {tipo === "FIDELIZADO" && <AddTaskSharpIcon className="mr-2 mb-1" />}
                        {tipo}
                      </td>
                    </tr>
                  );
                }}
              />
            </div>
          </>
        )}
      </CardBody>
      <CardFooter>
        <PaginationButtons page={page} setPage={setPage} maxPage={maxPage} data={filteredData} />
      </CardFooter>
    </Card>
  );
}  
export default Prestadores;