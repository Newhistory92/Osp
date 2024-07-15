

import React, { useState, useEffect,useCallback, useMemo} from "react";
import "./Styles/buttomAvatar.css"
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';
import AddTaskSharpIcon from '@mui/icons-material/AddTaskSharp';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import PaginationButtons from "../../components/Pagination/Pagination";
import dynamic from 'next/dynamic';
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
import "react-loading-skeleton/dist/skeleton.css";
import { Prestador } from "@/app/interfaces/interfaces";
import avatarDefault from "../../../../public/Avatar_default.webp";

const Avatar_Default = avatarDefault.src;

const PrestadorCard  = dynamic(() => import ('./CardsPrestador'),{
  ssr:false
})

const FilterUser  = dynamic(() => import ('./Filtros/UseAutocomplete'),{
  ssr:false
})
const FilterEspecialidad   = dynamic(() => import ('./Filtros/FilterEspecialidad'),{
  ssr:false
})



const TABS = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Fidelizado', value: 'Fidelizado' },
  { label: 'No Fidelizado', value: 'No Fidelizado' }
];

const TABLE_HEAD = ["Prestador", "Especialidad", "Teléfono", "Direccion", "Tipo"];
 


const Prestadores = () => {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [filteredDataUser, setFilteredDataUser] = useState<Prestador[]>([]);
  const [filteredDataEspecialidad, setFilteredDataEspecialidad] = useState<Prestador[]>([]);
  const [combinedFilteredData, setCombinedFilteredData] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedPrestador, setSelectedPrestador] = useState<Prestador | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const perPage = 8;
  

 

  const fetchPrestadores = useCallback(async () => {
    try {
      const url = '/api/Datos/prestadores';
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = await response.json();
      console.log(responseData)
      if (Array.isArray(responseData.data)) {
        const formattedData = responseData.data.map((prestador: {
          IdPrestador: any; Domicilio: string; Localidad: string; Fidelizado: string | null; Telefono:  string; Nombre: string; especialidad: string; 
}) => {
          const address = `${prestador.Domicilio}, ${prestador.Localidad}`;
          const tipo = (prestador.Fidelizado === "0" || prestador.Fidelizado === null) ? "No Fidelizado" : "Fidelizado";
          const phoneOpc = prestador.Telefono;
          const name =prestador.Nombre;
          const especialidad = prestador.especialidad;
          const id = prestador.IdPrestador
          return {
            ...prestador,
            address: address,
            tipo,
            phoneOpc,
            name,
            especialidad,
            id
          };
        });
        setPrestadoresAndLoading(formattedData, false);
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
    setFilteredDataUser(prestadoresData);
    setFilteredDataEspecialidad(prestadoresData);
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
      console.log("Selected type is Todos");
      setFilteredDataUser(prestadores);
      setFilteredDataEspecialidad(prestadores);
    } else {
      const filtered = prestadores.filter((prestador) => prestador.tipo.toLowerCase() === selectedType.toLowerCase());
      console.log(`Filtered prestadores: ${filtered.length} items for type ${selectedType}`);
      setFilteredDataUser(filtered);
      setFilteredDataEspecialidad(filtered);
    }
  };

  console.log("Running filterPrestadores useEffect");
  filterPrestadores();
}, [selectedType, prestadores]);

useEffect(() => {
  const combined = filteredDataUser.filter((prestador) =>
    filteredDataEspecialidad.includes(prestador)
  );
  setCombinedFilteredData(combined);
}, [filteredDataUser, filteredDataEspecialidad]);


const handleTabChange = useCallback((value: string) => {
  console.log(`Tab changed to: ${value}`);
  setSelectedType(value);
  setPage(1);
}, []);

const maxPage = useMemo(() => Math.ceil(combinedFilteredData.length / perPage), [combinedFilteredData.length, perPage]);

const handleAvatarButtonClick = (prestador: Prestador | null) => {
  if (prestador && selectedPrestador && selectedPrestador.id === prestador.id) {
    return;
  }
  console.log("handleAvatarButtonClick called with:", prestador); // Depuración
  setSelectedPrestador(prestador);
  onOpen();
};


  
  return (
    <Card className="w-full h-screen mx-auto">
      <div className="sticky top-0 z-10 bg-white">
        <CardHeader floated={false} shadow={false} className="rounded bg-gray-300">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Lista de Prestadores
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
            <div className="flex flex-col items-center w-full md:flex-row md:w-auto gap-4">
              <div className="w-full flex-grow">
              <FilterUser prestadores={prestadores} setFilteredData={setFilteredDataUser} />
              </div>
              <div className="w-full flex-grow mb-2">
              <FilterEspecialidad prestadores={prestadores} setFilteredData={setFilteredDataEspecialidad} />
              </div>
            </div>
          </div>
        </CardHeader>
      </div>
      <CardBody className="px-0 overflow-auto">
        {loading ? (
          <div className="overflow-auto">
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
              <tbody>
                {[...Array(6)].map((_, index) => (
                  <tr key={index} className="bg-gray-300">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton circle={true} height={40} width={40} className="bg-gray-200 border border-gray-300" />
                        <div className="flex flex-col">
                          <Skeleton width={100} height={20} className="bg-gray-200 border border-gray-300" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <Skeleton width={150} height={20} className="bg-gray-200 border border-gray-300" />
                      </div>
                    </td>
                    <td className="p-4">
                      <Skeleton width={120} height={20} className="bg-gray-200 border border-gray-300" />
                    </td>
                    <td className="p-4">
                      <Skeleton width={100} height={20} className="bg-gray-200 border border-gray-300" />
                    </td>
                    <td className="p-4">
                      <Skeleton width={80} height={20} className="bg-gray-200 border border-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <tbody>
              {combinedFilteredData.slice((page - 1) * perPage, page * perPage).map((prestador, index) => {
                  const { id, name,  imageUrl, phone, phoneOpc, especialidad, address, tipo, checkedPhone, especialidad2, especialidad3 } = prestador;
                  const displayTipo = tipo.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
                  const rowClass = index % 2 === 0 ? "bg-gray-50" : "bg-gray-300";
                  return (
                    <tr key={id} className={rowClass}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button className="avatar-button" onClick={() => handleAvatarButtonClick(prestador)}>
                            <Avatar src={imageUrl || Avatar_Default}  size="sm" />
                          </button>
                          <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            <MedicalInformationOutlinedIcon className="mr-2 mb-1" />
                            {especialidad} <ChevronRightOutlinedIcon fontSize="small" />
                            {especialidad2} <ChevronRightOutlinedIcon fontSize="small" />
                            {especialidad3}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-max">
                          <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
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
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <AddLocationOutlinedIcon className="mr-2 mb-1" />
                          {address}
                        </Typography>
                      </td>
                      <td className="p-4">
                        {tipo === "Fidelizado" && <AddTaskSharpIcon className="mr-2 mb-1" />}
                        {displayTipo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
      <CardFooter>
        <PaginationButtons page={page} setPage={setPage} maxPage={maxPage} data={combinedFilteredData} />
      </CardFooter>
      <Modal
        size={"2xl"}
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        scrollBehavior={"outside"}
        backdrop={"blur"}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1 z-100">Obra Social Provincia</ModalHeader>
            <ModalBody>
              {selectedPrestador && <PrestadorCard key={selectedPrestador.id} {...selectedPrestador} />}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </Card>
  );
  
}
export default Prestadores;