import { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useAppSelector } from "../../hooks/StoreHook";
import { useMediaQuery } from 'react-responsive';
import {
    Row,
    Col,
    Image,
    Dropdown,
    ListGroup,
    Modal,
    Button,
} from 'react-bootstrap';
import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import useMounted from '../../hooks/useMounted';
import { UserButton, useUser } from '@clerk/nextjs';
import NotificationsAccordion from '../../User3/operador/Notificador/Notification-history';
import MailRoundedIcon from '@mui/icons-material/MailRounded';

interface Notificacion {
    id: string;
    titulo: string;
    contenido: string;
    autor: string;
    receptor: string;
    status: string;
    createdAt: string | number | Date;
}

const QuickMenu = () => {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const currentUser = useAppSelector(state => state.user.currentUser);
    const [newMessagesCount, setNewMessagesCount] = useState<number>(0);
    const userData = currentUser ? (Array.isArray(currentUser) ? currentUser[0] : currentUser) : null;
    const receptorId = userData ? userData.id : null;
    const hasMounted = useMounted();


    useEffect(() => {
        const getNotificaciones = async () => {
          try {
            const response = await fetch(`/api/datos/notificados?receptorId=${receptorId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error('Error al obtener las notificaciones');
            }
            const data = await response.json();
            console.log(data);
            if (response.ok) {
              setNotificaciones(data);
            }
          } catch (error) {
            console.error('Error al obtener las notificaciones:', error);
            throw error;
          }
        };
    
        getNotificaciones(); // Llama a la función getNotificaciones para obtener las notificaciones cuando el componente se monta
      }, [receptorId])
  


      const countNewMessages = () => {
        const newMessages = notificaciones.filter(notificacion => notificacion.status === 'No_leido');
        setNewMessagesCount(newMessages.length);
    };

    useEffect(() => {
        countNewMessages();
    }, [notificaciones]);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const { isLoaded, user } = useUser();
 
    if (!isLoaded) {

      return null;
    }
   
    if (!user) return null;
    

    const Notifications = () => {
        return (
            <SimpleBar style={{ maxHeight: '300px' }}>
                <ListGroup variant="flush">
                    {notificaciones.slice(0, 3).map((item, index) => ( // Se utiliza slice para obtener solo las tres primeras notificaciones
                        <ListGroup.Item className={index === 0 ? 'bg-light' : ''} key={item.id}>
                            <Row>
                                <Col>
                                    <Link href="#" className="text-muted">
                                        <h5 className=" mb-1">{item.titulo}</h5>
                                        <p className="mb-0">{item.contenido}</p>
                                    </Link>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </SimpleBar>
        );
    };

    const QuickMenuDesktop = () => {
        const [showModal, setShowModal] = useState(false); 

        const handleCloseModal = () => setShowModal(false); 
        
    return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">{newMessagesCount}</span>
            <Dropdown as="li" className="stopevent">
            <Dropdown.Toggle as="a" bsPrefix=' ' id="dropdownNotification" className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted">
               <i className="fe fe-bell"></i>
                    <div className="relative">
              <MailRoundedIcon/>
                </div>
               </Dropdown.Toggle>

                <Dropdown.Menu
                    className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                    aria-labelledby="dropdownNotification"
                    align="end"
                    >
                    <Dropdown.Item className="mt-3" bsPrefix=' ' as="div"  >
                        <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                            <span className="h4 mb-0">Notificaciones</span>
                            <Link href="/" className="text-muted">
                                <span className="align-middle">
                                    <i className="fe fe-settings me-1"></i>
                                </span>
                            </Link>
                        </div>
                        <Notifications />
                        <div className="border-top px-3 pt-3 pb-3">
                       
                            <Button variant="link" onClick={() => setShowModal(true)}>Ver todas las notificaciones</Button>
                        </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown as="li" className="ms-5 ">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                    <div className="avatar avatar-md avatar-indicators avatar-online ">
                    <UserButton />
                    </div>
                </Dropdown.Toggle>
            </Dropdown>

        
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Todas las notificaciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <NotificationsAccordion notificaciones={notificaciones as Notificacion[]} />
                </Modal.Body>
            </Modal>
        </ListGroup>
    );
}

const QuickMenuMobile = () => {
    const [showModal, setShowModal] = useState(false); 

    const handleCloseModal = () => setShowModal(false); 
    
    return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">{newMessagesCount}</span>

            <Dropdown as="li" className="stopevent">
                <Dropdown.Toggle as="a"
                    bsPrefix=' '
                    id="dropdownNotification"
                    className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted">
                    <i className="fe fe-bell"></i>
                    <MailRoundedIcon />
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                    aria-labelledby="dropdownNotification"
                    align="end"
                    >
                    <Dropdown.Item className="mt-3" bsPrefix=' ' as="div"  >
                        <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                            <span className="h4 mb-0">Notificaciones</span>
                            <Link href="/" className="text-muted">
                                <span className="align-middle">
                                    <i className="fe fe-settings me-1"></i>
                                </span>
                            </Link>
                        </div>
                        <Notifications />
                        <div className="border-top px-3 pt-3 pb-3">
                            {/* Botón para abrir el modal */}
                            <Button variant="link" onClick={() => setShowModal(true)}>Ver todas las notificaciones</Button>
                        </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown as="li" className="ms-5 ">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                    <div className="avatar avatar-md avatar-indicators avatar-online ">
                    <UserButton />
                    </div>
                </Dropdown.Toggle>
            </Dropdown>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Todas las notificaciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NotificationsAccordion notificaciones={notificaciones as Notificacion[]} />
                </Modal.Body>
            </Modal>
        </ListGroup>
    );
}

    return (
        <Fragment>
            { hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    )
}

export default QuickMenu;