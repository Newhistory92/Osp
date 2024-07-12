import React from 'react';
import { Col, Row, } from "react-bootstrap";
import { ProfileHeaderProps } from '@/app/interfaces/interfaces';
import Header from "../../../../public/profile-cover.jpg"
import Image from 'next/image';
import Avatar_Default from "../../../../public/Avatar_default.webp"
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ imageUrl, name, apellido,email }) => {

    return (
        <Row className="align-items-center shadow-lg">
            <Col xl={12} lg={12} md={12} xs={12}>
                {/* Bg */}
                <div
                    className=" rounded-top "> 
                    <Image 
                    src={Header} alt="Fondo-badge"
                    height="1000"
                    width="1000 "
                    className="w-full h-full object-cover"
                    priority 
                    />
                    </div>
                <div className="bg-white rounded-bottom smooth-shadow-sm ">
                    <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
                        <div className="d-flex align-items-center">
                            {/* avatar */}
                            <div className=" position-relative  justify-content-end align-items-end ">
                                <Image
                                    src={imageUrl || Avatar_Default}
                                    className=" rounded-circle border border-white-color-40"
                                    alt="avatar"
                                    height="200"
                                    width="200"
                                    priority 
                                    rel="preload"
                                    
                                />
                                {/* Verificado */}
                                <Image
                                    src="https://img.icons8.com/color/48/verified-badge.png" alt="verified-badge"
                                    height="30"
                                    width="30"
                                    className="position-absolute top-0 right-0 me-5"
                                />
                            </div>
                            {/* text */}
                            <div className="lh-1">
                                <h2 className="mb-0">
                                    {name} {apellido}
                                </h2>
                                {/* Email */}
                                <p className="mb-0 d-block">{email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ProfileHeader;