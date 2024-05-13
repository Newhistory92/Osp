import { Col, Row, Container } from 'react-bootstrap';
import { useAppSelector } from "../../hooks/StoreHook";
import PageHeading from '../../widgets/PageHeading';
import ProfileHeader from './ProfileHeader';
import  UserCard from "../cards/Card";

const Profile = () => {
  const currentUser = useAppSelector(state => state.user.currentUser);
console.log("este estado global esta en el perfil",currentUser)
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Verificar si currentUser es un array o no
  const userData = Array.isArray(currentUser) ? currentUser[0] : currentUser;

  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Perfil"/>

      {/* Profile Header  */}
      {/* Pasar los datos del usuario al componente ProfileHeader */}
      <ProfileHeader 
        imageUrl={userData.imageUrl} 
        name={userData.name} 
        apellido={userData.apellido} 
        email={userData.email} 
      />

      {/* content */}
      <div className="py-6">
        <Row>
          {/* About Me */}
          <UserCard 
            id={userData.id}
            numeroOperador={userData.numeroOperador}
            dni={userData.dni}
            matricula={userData.matricula}
            phone={userData.phone}
            phoneopc={userData.phoneopc}
            role={userData.role}
            address={userData.address}
            especialidad={userData.especialidad}
            especialidad2={userData.especialidad2}
            especialidad3={userData.especialidad3}
            dependencia={userData.dependencia}
            tipo={userData.tipo}
            descripcion={userData.descripcion}
            checkedphone={userData.checkedphone}
           
          />

          {/* Projects Contributions */}
          {/* <ProjectsContributions /> */}

          {/* Recent From Blog */}
          {/* <RecentFromBlog /> */}

          <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            {/* My Team */}
            {/* <MyTeam /> */}

            {/* Activity Feed */}
            {/* <ActivityFeed /> */}
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Profile;
