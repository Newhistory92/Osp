import { Col, Row, Container } from 'react-bootstrap';
import { useAppSelector } from "../../hooks/StoreHook";
import ProfileHeader from './ProfileHeader';
import  UserCard from "../Cards/Card";
import { UserInfo } from '@/app/interfaces/interfaces';
import Loading from '../Loading/loading';


const Profile = () => {
  const currentUser = useAppSelector((state: { user: { currentUser: UserInfo | null; }; }) => state.user.currentUser);
//console.log("este estado global esta en el perfil",currentUser)
  if (!currentUser) {
    return <div><Loading/></div>;
  }

  // Verificar si currentUser es un array o no
  const userData = Array.isArray(currentUser) ? currentUser[0] : currentUser;

  return (
    <Container fluid className="p-6">
      <ProfileHeader 
        imageUrl={userData.imageUrl} 
        name={userData.name} 
        email={userData.email} 
      />
      <div className="py-6">
        <Row>
          <UserCard 
            id={userData.id}
            numeroOperador={userData.numeroOperador}
            dni={userData.dni}
            matricula={userData.matricula}
            phone={userData.phone}
            phoneOpc={userData.phoneOpc}
            role={userData.role}
            address={userData.address}
            especialidad={userData.especialidad}
            especialidad2={userData.especialidad2}
            especialidad3={userData.especialidad3}
            dependencia={userData.dependencia}
            tipo={userData.tipo}
            descripcion={userData.descripcion}
            checkedPhone={userData.checkedPhone}
          />
          <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Profile;
