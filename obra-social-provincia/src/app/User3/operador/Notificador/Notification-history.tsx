import Accordion from 'react-bootstrap/Accordion';
import { Notificador} from '@/app/interfaces/interfaces';


interface NotificationsAccordionProps {
    notificaciones: Notificador[];
}

function NotificationsAccordion({ notificaciones }: NotificationsAccordionProps) {
    return (
        <Accordion defaultActiveKey={['0']} alwaysOpen>
            {notificaciones.map((notificacion, index) => (
                <Accordion.Item eventKey={index.toString()} key={notificacion.id}>
                    <Accordion.Header>{notificacion.titulo}</Accordion.Header>
                    <Accordion.Body>
                        {notificacion.contenido}
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}

export default NotificationsAccordion;

