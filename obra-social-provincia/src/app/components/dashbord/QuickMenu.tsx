

import { useAppSelector } from "../../hooks/StoreHook";
import { useMediaQuery } from 'react-responsive';
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { ListGroup, Row, Col, Modal, Dropdown, Button } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import useMounted from '../../hooks/useMounted';
import {useUser } from '@clerk/nextjs';
import NotificationsAccordion from '../../User3/operador/Notificador/Notification-history';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import ButtonUser from '../UserComponent/ButtomUser';
import {Notificacion  } from '@/app/interfaces/interfaces';
import "../../styles/theme.scss"
import parse from 'html-react-parser';
import { Dialog } from 'primereact/dialog';


const QuickMenu = () => {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const currentUser = useAppSelector(state => state.user.currentUser);
    const [newMessagesCount, setNewMessagesCount] = useState<number>(0);
    const userData = currentUser ? (Array.isArray(currentUser) ? currentUser[0] : currentUser) : null;
    const receptorId = userData ? userData.id : null;
    const hasMounted = useMounted()
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedNotification, setSelectedNotification] = useState<Notificacion | null>(null);



    useEffect(() => {
        const getNotificaciones = async () => {
            try {
                const response = await fetch(`/api/Datos/notificados?receptorId=${receptorId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al obtener las notificaciones del receptor');
                }
                const data = await response.json();
                console.log(data);
                setNotificaciones(data);
            } catch (error) {
                console.error('Error inesperado al obtener las notificaciones del receptor:', error);
            }
        };
        if (receptorId) {
            getNotificaciones();
        }
    }, [receptorId]);


    
    const countNewMessages = useCallback(() => {
        const newMessages = notificaciones.filter(notificacion => notificacion.status === 'No_leido');
        setNewMessagesCount(newMessages.length);
    }, [notificaciones]);

    useEffect(() => {
        countNewMessages();
    }, [notificaciones, countNewMessages]);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const { isLoaded, user } = useUser();
 
    if (!isLoaded) {

      return null;
    }
   
    if (!user) return null;

    const handleButtonClick = (notification: Notificacion) => {
        setSelectedNotification(notification);
        setVisible(true);
    };

    const Notifications = () => {
        return (
            <SimpleBar style={{ maxHeight: '300px' }}>
                <ListGroup variant="flush">
                    {notificaciones.slice(0, 3).map((item, index) => ( 
                        <ListGroup.Item className={index === 0 ? 'bg-light' : ''} key={item.id}>
                            <Row>
                                <Col>
                                <Button variant="link" onClick={() => handleButtonClick(item)}>
                                    <h5 className="mb-1">{item.titulo}</h5>
                                    <p className="mb-0">{parse(item.contenido.slice(0, 20))}</p>
                                </Button>
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
                            <MailRoundedIcon />
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                        className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                        aria-labelledby="dropdownNotification"
                        align="end"
                    >
                        <Dropdown.Item className="mt-3" bsPrefix=' ' as="div">
                            <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                                <span className="h4 mb-0">Notificaciones</span>
                            </div>
                            <Notifications />
                            <div className="border-top px-3 pt-3 pb-3">
                                <Button variant="link" onClick={() => setShowModal(true)}>Ver todas las notificaciones</Button>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown as="li" className="ms-5">
                    <Dropdown.Toggle as="a" bsPrefix=' ' className="rounded-circle" id="dropdownUser">
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <ButtonUser />
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
    };

    return (
        <div>
            <QuickMenuDesktop />
            {selectedNotification && (
                <Dialog
                    header={selectedNotification.titulo}
                    visible={visible}
                    onHide={() => setVisible(false)}
                    style={{ width: '50vw' }}
                    breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                >
                    <div>{parse(selectedNotification.contenido)}</div>
                </Dialog>
            )}
        </div>
    );
    

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
                    <ButtonUser />
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