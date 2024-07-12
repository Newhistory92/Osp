import React, { useState } from 'react';
import { Card, Col, Row, } from 'react-bootstrap';
import ProfileHeader from "../../components/Perfil/ProfileHeader";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AddIcCallSharpIcon from '@mui/icons-material/AddIcCallSharp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { Prestador } from '@/app/interfaces/interfaces';


const PrestadorCard: React.FC<Prestador > = ({  id, name, apellido, imageUrl, phone,phoneOpc, especialidad, address, tipo,
    descripcion,checkedPhone, especialidad2,especialidad3 }) => {
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);

    return (
        <>
            <Col xl={50} lg={15} md={12} xs={12} className="mb-6">
                <Card onClick={handleShowModal}>
                    <Card.Body>

                        <div className=" mb-6">
                        <ProfileHeader imageUrl={imageUrl} name={name} apellido={apellido} />
                        </div>
                        <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Un Poco Sobre Mi</span>
                        <p className="mt-2 mb-6">{descripcion}</p>
                        <Row>
                            <Col xs={12} className="mb-5">
                                <h6 className="text-uppercase fs-5 ls-2"> <MedicalInformationIcon/>Especialidad</h6>
                                <p >{especialidad}</p> <p>{especialidad2}</p> <p>{especialidad3}</p>
                            </Col>
                            {checkedPhone && (
                           <Col xs={12} className="mb-5">
                           <h6 className="text-uppercase fs-5 ls-2 ">< AddIcCallSharpIcon/>Teléfono</h6>
                            <p className="mb-0">{phone}</p>
                           </Col>)}
                           <Col>
                           <p className="">{phoneOpc}</p>
                            </Col>
                            <Col xs={12} className="mb-5">
                                <h6 className="text-uppercase fs-5 ls-2"> <CheckCircleIcon />Estado</h6>
                                <p className="mb-0">{tipo}</p>
                            </Col>
                            <Col xs={12} className="mb-5">
                                <h6 className="text-uppercase fs-5 ls-2"> <AddLocationIcon/>Direccion</h6>
                                <p className="mb-0">{address}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};

export default PrestadorCard;

