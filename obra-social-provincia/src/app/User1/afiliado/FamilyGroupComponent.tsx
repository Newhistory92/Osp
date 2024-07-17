import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useAppSelector,useAppDispatch } from "../../hooks/StoreHook"
import {setLoading} from '@/app/redux/Slice/loading';
import Loading from '@/app/components/Loading/loading';
import {  UserInfo} from '@/app/interfaces/interfaces';
import parentesco from "../../../../parentesco.json"
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Accordion, AccordionTab } from 'primereact/accordion';

function formatFecha(fecha: string | undefined): string {
  if (!fecha) return 'Fecha inválida';
  const parsedFecha = parseISO(fecha);
  return fecha === '1900-01-01T00:00:00.000Z' 
    ? 'Permanente' 
    : isValid(parsedFecha) 
      ? format(parsedFecha, 'dd/MM/yyyy', { locale: es }) 
      : 'Fecha inválida';
}

export default function FamilyGroup() {
  const [grupsData, setGrupsData] = React.useState<any>(null);
  const familyGroupOpen = useAppSelector(state => state.navbarvertical.familyGroupOpen);
  const currentUser = useAppSelector((state: { user: { currentUser: UserInfo | null; }; }) => state.user.currentUser);
  const dispatch = useAppDispatch();

  if (!currentUser) {
    return <div><Loading /></div>;
  }

  const userData = Array.isArray(currentUser) ? currentUser[0] : currentUser;

  const fetchGrup = React.useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`/api/Datos/afiliado?dni=${userData.dni}`);
      const data = await response.json();
      console.log("respuesta del backend", data);
      setGrupsData(data);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      setGrupsData(null);
    } finally {
      dispatch(setLoading(false));
    }
  }, [userData.dni, dispatch]);

  React.useEffect(() => {
    if (familyGroupOpen) {
      fetchGrup();
    }
  }, [familyGroupOpen, fetchGrup]);

  const renderGrupsDataInfo = (grup: any) => {
    const capitalizeWords = (str: string) => {
      return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  };
    const carnetVencimiento = grup.CarnetVencimiento === '1900-01-01T00:00:00.000Z' ? 'Permanente' : formatFecha(grup.CarnetVencimiento);
    const fecNac = formatFecha(grup.FecNac);
    const fecAlt = formatFecha(grup.FecAlt);
    const fechabaja = grup.Fechabaja === '1900-01-01T00:00:00.000Z' ? 'Sin baja' : formatFecha(grup.Fechabaja);
    const parentescoNombre = parentesco.find(p => p.Codigo === grup.Parentesco)?.Nombre || 'Desconocido';
    const carnetVencimientoParcial = grup.CarnetVencimientoParcial !== '1900-01-01T00:00:00.000Z' ? `Recuerde regularizar su situación semanas antes de la fecha: ${formatFecha(grup.CarnetVencimientoParcial)}` : '';
    const fecEmbara = grup.FecEmbara !== '1900-01-01T00:00:00.000Z' ? `Fecha de embarazo: ${formatFecha(grup.FecEmbara)}` : '';
    const fecParto = grup.FecParto !== '1900-01-01T00:00:00.000Z' ? `Fecha de parto: ${formatFecha(grup.FecParto)}` : '';

    
    
    return (
      <div key={grup.Codigo}>
        <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
          <strong>Afiliado:</strong> {parentescoNombre} <br />
          <strong>DNI:</strong> {grup.Codigo}
        </Typography>
        <Divider variant="inset"  />
        <br />
        <strong>Reparticion Publica:</strong> {currentUser.dependencia} <br />
        <strong>Fecha de Alta:</strong> {fecAlt} <br />
        <Divider variant="inset"  />
        <strong>Fecha de Nacimiento:</strong> {fecNac} <br />
        <strong>Fecha de Baja:</strong> {fechabaja} <br />
        {carnetVencimientoParcial && (
          <>
            <strong>{carnetVencimientoParcial}</strong> <br />
          </>
        )}
        {fecEmbara && (
          <>
            <strong>{fecEmbara}</strong> <br />
          </>
        )}
        {fecParto && (
          <>
            <strong>{fecParto}</strong> <br />
          </>
        )}
        <Divider variant="inset" component="div" />
        <strong>Vencimiento del Carnet:</strong> {carnetVencimiento} <br />
      </div>
    );
  };

  return (
    <div className="card">
      <Accordion>
        {grupsData && (
          <AccordionTab header={grupsData.Nombre}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={parentesco.find(p => p.Codigo === grupsData.Parentesco)?.Nombre === 'Titular' ? 'Afiliado Titular' : 'Afiliado Indirecto'}
                secondary={renderGrupsDataInfo(grupsData)}
              />
            </ListItem>
          </AccordionTab>
        )}
      </Accordion>
    </div>
  );
}