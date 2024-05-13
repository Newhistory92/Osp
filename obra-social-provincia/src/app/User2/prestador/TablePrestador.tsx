

import React, { useState, useEffect, Suspense } from "react";
import "./styles/buttomAvatar.css"
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
  const [selectedType, setSelectedType] = useState("Todos"); // Estado para almacenar el tipo seleccionado
  const [selectedPrestador, setSelectedPrestador] = useState<Prestador | null>(null);
  const [noResults, setNoResults] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure()
//console.log (prestadores)
const [page, setPage] = useState(1);
const perPage = 8;
  
  

  useEffect(() => {
    fetchPrestadores();
  }, []);

  const fetchPrestadores = async () => {
    try {
      const url = '/api/datos/prestador';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const responseData: Prestador[] = await response.json();
      if (Array.isArray(responseData)) {
        setPrestadores(responseData);
        setFilteredData(responseData);
      } else {
        console.error('La respuesta de la API no es un arreglo:', responseData);
      }
    } catch (error) {
      console.error('Error al obtener los prestadores:', error);
    } finally {
      setLoading(false);
    }
  };






  useEffect(() => {
    const totalPrestadores = prestadores.length;
    const totalPages = Math.ceil(totalPrestadores / perPage);
    if (totalPages === 0 || page > totalPages) {
      setPage(totalPages);
      return;
    }
  
    setLoading(false);
    setNoResults(false);
  }, [prestadores, page, perPage]);
  

  useEffect(() => {
    filterPrestadores();
  }, [prestadores, selectedType])
 
  const filterPrestadores = () => {
    if (selectedType === "Todos") {
      setFilteredData(prestadores);
    } else {
      const filtered = prestadores.filter((prestador) => prestador.tipo === selectedType);
      setFilteredData(filtered);
    }
  };

  const maxPage = Math.ceil(selectedType === "Todos" ? prestadores.length : filteredData.length / perPage);



  const handleTabChange = (selectedType: string) => {
    console.log("Tipo seleccionado:", selectedType);
    
    // Filtrar los datos basados en el tipo seleccionado
    const filtered = prestadores.filter(prestador => {
      if (selectedType === "Todos") {
        return true; // Mostrar todos los prestadores
      } else if (selectedType === "Fidelizado") {
        return prestador.tipo.toLowerCase().includes("fidelizado"); // Mostrar prestadores con tipo que contiene "fidelizado"
      } else if (selectedType === "No Fidelizado") {
        return prestador.tipo.toLowerCase().includes("no_fidelizado"); // Mostrar prestadores con tipo que contiene "no fidelizado"
      } else {
        return prestador.tipo.toLowerCase() === selectedType.toLowerCase(); // Mostrar prestadores del tipo seleccionado
      }
    });
  
    // Actualizar el estado de los datos filtrados
    console.log("Datos filtrados:", filtered);
    setFilteredData(filtered);
  
    // Reiniciar la página a la primera al cambiar de tipo
    setPage(1);
  };
  
  
 
  const handleAvatarButtonClick = (prestador) => {
    setSelectedPrestador(prestador);
    onOpen();
  };
  const openModal = (prestador: Prestador) => {
    setSelectedPrestador(prestador);
    onOpen();
  };

  return (
   
    <Card className="h-full w-full ">
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
          
          <div className="flex items-center">
  <div className="flex-grow mr-4">
    <FilterUser prestadores={prestadores} openModal={openModal} />
  </div>
  <div className="flex-grow mb-2">
    <FilterEspecialidad prestadores={prestadores} setFilteredData={setFilteredData} />
  </div>
</div>

        </div>
      </CardHeader>
      <Suspense fallback={<Skeleton height={400} count={8} />}>
      <CardBody className="overflow-x-auto px-0 ">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {filteredData.map(({ id, name, apellido, imageUrl, phone, phoneopc, especialidad, address, tipo, descripcion, checkedphone, especialidad2, especialidad3, coordinatesLat, coordinatesLon }, index) => {
              const isLast = index === filteredData.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={name}>
                    <td className={classes}>
                    <div className="flex items-center gap-3">
                      <button className="avatar-button"  onClick={() => handleAvatarButtonClick({  id, name, apellido, imageUrl, phone, phoneopc, especialidad, address, tipo,
                       descripcion,checkedphone,especialidad2,especialidad3, })}>
                     <Avatar src={imageUrl} alt={apellido} size="sm" />
                     </button>

                  <Modal
                 size={"2xl"}
                 isOpen={isOpen}
                 onClose={onClose}
                 scrollBehavior={"outside"}
                 backdrop={"blur"}
                 classNames={{
                 body: "py-6",
                 backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                 base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
                header: "border-b-[1px] border-[#292f46]",
               footer: "border-t-[1px] border-[#292f46]",
               closeButton: "hover:bg-white/5 active:bg-white/10",
                }}>
                <ModalContent>
                   {(onClose) => (
                       <>
              <ModalHeader className="flex flex-col gap-1">Obra Social Provincia</ModalHeader>
              <ModalBody>
              {selectedPrestador && (
            <PrestadorCard {...selectedPrestador} />
          )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
            Cerrar
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {name} {apellido}
                          </Typography>
                        
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal  p-4 border-b border-blue-gray-50 bg-blue-gray-50/50" 
                        >   
                         <td className="align-middle  ">
                          <MedicalInformationOutlinedIcon className="mr-2 mb-1" />
                          {especialidad} <ChevronRightOutlinedIcon fontSize="small"/>
                          {especialidad2}<ChevronRightOutlinedIcon fontSize="small"/> 
                          {especialidad3}
                          </td>
                          
                        </Typography>

                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70">
                          <td className="align-middle ">
                         {checkedphone && (
                        <> <LocalPhoneOutlinedIcon className="mr-2" />{phone}<ChevronRightOutlinedIcon fontSize="small"/></>)}
                         {phoneopc && ( <><LocalPhoneOutlinedIcon className="mr-2" /> {phoneopc} </>   )}
                          </td>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal  p-4 border-b border-blue-gray-50 bg-blue-gray-50/50">
                        <td className="align-middle"><AddLocationOutlinedIcon className="mr-2 mb-1" />{address}</td>            
                      </Typography>
                    </td>
                    <td className={classes}>
                    {tipo === "FIDELIZADO" && <AddTaskSharpIcon className="mr-2 mb-1" />}{tipo}
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t  border-blue-gray-50 p-4">
        <div className=" items-center justify-center w-full ">
     <PaginationButtons
      page={page}
      setPage={setPage}
      maxPage={maxPage}
      data={prestadores} 
    />
  </div>
</CardFooter>
</Suspense>
    </Card>
  );
}

export default Prestadores;





