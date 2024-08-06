import React, { useCallback, useEffect,  useState } from "react";
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useAppSelector, useAppDispatch } from "../../hooks/StoreHook";
import { setLoading } from '@/app/redux/Slice/loading';
import Loading from '@/app/components/Loading/loading';
import { GrupData } from '@/app/interfaces/interfaces';
import parentesco from "../../../../parentesco.json";
import { format, parseISO, isValid, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Image from "next/image";
import IcontComentario from "../../../../public/icons-comentarios.png"
import { addGrupFamiliarMember,clearGrupFamiliar  } from "@/app/redux/Slice/userSlice";

function formatFecha(fecha: string | null): string {
  if (!fecha) return 'Fecha inválida';
  const parsedFecha = parseISO(fecha);
  return isValid(parsedFecha)
    ? format(addDays(parsedFecha, 1), 'dd/MM/yyyy', { locale: es })
    : 'Fecha inválida';
}


function capitalizeWords(str: string) {
  return str ? str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()) : '';
}


export default function FamilyGroup() {
  const [grupsData, setGrupsData] = React.useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Nuevo estado para rastrear si ya hemos hecho la llamada
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
 console.log( currentUser )

  const userData = Array.isArray(currentUser) ? currentUser[0] : currentUser;
  const fetchGrup = useCallback(async () => {
    if (!userData || hasFetched) return;
    setHasFetched(true); // Marcamos como ya realizado
    dispatch(setLoading(true));
    try {
      const response = await fetch(`/api/Datos/afiliado?doctit=${userData.dni}`);
      const data = await response.json();
      const uniqueData = Array.isArray(data) ? data.filter((item, index, self) =>
        index === self.findIndex((t) => t.Codigo === item.Codigo)) : [data];
      
      setGrupsData(uniqueData);
      const grupDnis = uniqueData.map(item => item.Codigo);
      grupDnis.forEach(dni => {
        dispatch(addGrupFamiliarMember(dni));
      });
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      setGrupsData([]);
    } finally {
      dispatch(setLoading(false));
    }
  }, [userData, hasFetched, dispatch]);

  useEffect(() => {
    dispatch(clearGrupFamiliar());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      fetchGrup();
    }
  }, [fetchGrup, userData]);

  if (!currentUser) {
    return <div><Loading /></div>;
  }


  const renderGrupsDataInfo = (grup: GrupData) => {
    const carnetVencimiento = grup.FecVenciCarnet === '9999-12-31T00:00:00.000Z' ? 'Permanente' : formatFecha(grup.FecVenciCarnet);
    const fecNac = formatFecha(grup.FecNac);
    const fecAlt = formatFecha(grup.FecAlt);
    const fechabaja = grup.Fechabaja && grup.Fechabaja !== '1900-01-01T00:00:00.000Z' ? formatFecha(grup.Fechabaja) : null;
    const bajaMessage = fechabaja ? `Razón: ${capitalizeWords(grup.razonBaja)}` : '';
  
    const carnetVencimientoParcial = grup.VTOParcial && grup.VTOParcial !== '1900-01-01T00:00:00.000Z'
      
  

  
   
  
    return (
      <div key={grup.Codigo}>
        <Typography sx={{ display: 'inline' }} component="span" variant="subtitle2"  color="text.primary">
          <strong>DNI:</strong> {grup.Codigo}
        </Typography>
        <br />
        <strong>Repartición Pública:</strong> {currentUser.dependencia} <br />
        <strong>Fecha de Alta:</strong> {fecAlt} <br />
        <strong>Fecha de Nacimiento:</strong> {fecNac} <br />
        {fechabaja && (
          <>
            <Divider variant="inset" component="div" />
            <strong>Fecha de Baja:</strong> {fechabaja}  &nbsp;&nbsp;
            <strong>{bajaMessage}</strong> <br />
          </>
        )}
        <Divider variant="inset" component="div" />
        <strong>Carnet Vencimiento:</strong> {carnetVencimiento} <br />
        {carnetVencimientoParcial && (
          <>
            <Divider variant="inset" component="div" />
            <div className="flex items-center mt-2">
          <Image width="32" height="32" src={IcontComentario} alt="comments" />
          <Button
            label={`Usted Posee un Vencimiento Parcial- Recuerde regularizar su situación días antes de la fecha: ${formatFecha(grup.VTOParcial)}`}
            severity="warning"
            text
            raised
            link
            onClick={() => setModalVisible(true)}
          />
        </div>
            <Dialog header="Motivo" visible={modalVisible} onHide={() => setModalVisible(false)}
              style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
              <p>{grup.Motivo}</p>
            </Dialog>
            <br />
          </> )}
           <footer>
           <Typography variant="caption" color="textSecondary" align="center">
             Cualquier información que no coincida o no se encuentre actualizada debe acercarse por Afiliaciones presencialmente.
           </Typography>
         </footer>
        
      </div>
    );
  };
  
  return (
    <div className="card">
      <Accordion>
        {grupsData.map((grupData: GrupData) => (
          <AccordionTab key={grupData.Codigo} header={grupData.Nombre}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={
                  parentesco.find(p => p.Codigo === grupData.Parentesco)?.Nombre === 'Titular'
                    ? <Typography variant="h6" color="textPrimary" component="strong">Afiliado Titular</Typography>
                    : <Typography variant="h6" color="textPrimary" component="strong">Afiliado Indirecto ({parentesco.find(p => p.Codigo === grupData.Parentesco)?.Nombre || 'Desconocido'})</Typography>
                }
                secondary={renderGrupsDataInfo(grupData)}
              />
            </ListItem>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );}