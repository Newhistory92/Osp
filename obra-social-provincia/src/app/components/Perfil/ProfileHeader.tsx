import React from 'react';
import { Col, Row, Image } from "react-bootstrap";
import { ProfileHeaderProps } from '@/app/interfaces/interfaces';



const ProfileHeader: React.FC<ProfileHeaderProps> = ({ imageUrl, name, apellido,email }) => {

    
    return (
        <Row className="align-items-center shadow-lg">
            <Col xl={12} lg={12} md={12} xs={12}>
                {/* Bg */}
                <div
                    className="pt-20 rounded-top"
                    style={{
                        background: `url("/obra-social-provincia/public/header1.jpg) no-repeat`,
                        backgroundSize: "cover",
                    }}
                ></div>
                <div className="bg-white rounded-bottom smooth-shadow-sm ">
                    <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
                        <div className="d-flex align-items-center">
                            {/* avatar */}
                            <div className="avatar-xxl   me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                                <Image
                                    src={imageUrl}
                                    className="avatar-xxl rounded-circle border border-white-color-40"
                                    alt=""
                                />
                                {/* Verificado */}
                                <Image
                                    src="https://img.icons8.com/color/48/verified-badge.png" alt="verified-badge"
                                    
                                    height="30"
                                    width="30"
                                    className="position-absolute top-0 right-0 me-2"
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