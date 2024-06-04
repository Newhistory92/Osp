import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import prisma from "../../../lib/prisma";
import { checkUserAuthentication } from "../../checkUser/authUtils";


export async function POST(request) {
    try {
        console.log("Iniciando función POST...");

        const user = await currentUser();
        console.log("Usuario actual:", user);

        const body = await request.json();
        console.log("Cuerpo de la solicitud:", body);

        const matricula = body.matricula;
        const especialidad = body.especialidad;
        const email = user.emailAddresses[0].emailAddress;
        const userId = user.id;
       
        
        
        console.log("Matrícula:", matricula);
        console.log("Especialidad:", especialidad);
        console.log("Correo electrónico:", email);
        console.log("ID de usuario:", userId);

        // Verificar si el usuario ya está asociado a una cuenta existente
        
        const isAuthenticated = await checkUserAuthentication(userId, 'prestador');
        console.log(isAuthenticated.status,isAuthenticated.message )
        if (isAuthenticated === false) {
            return NextResponse.json({ status: 404, message: isAuthenticated.message });
        }
        // Verificar si el DNI ya está asociado a un usuario en la base de datos
        const existingUserWithMatricula = await prisma.prestador.findFirst({
            where: {
                matricula: matricula
            }
        });
        console.log("Usuario existente con matrícula:", existingUserWithMatricula);

        if (existingUserWithMatricula) {
            return NextResponse.json({ status: 400, message: `La Matricula N°: ${existingUserWithMatricula.matricula} ya está asociado a un Prestador` });
        }

        // Verificar si el usuario ya existe en la base de datos por su email
        const existingUserWithEmail = await prisma.prestador.findFirst({
            where: {
                email: email
            }
        });
        console.log("Usuario existente con correo electrónico:", existingUserWithEmail);

        if (existingUserWithEmail) {
            return NextResponse.json({ status: 400, message: `El Correo Electrónico ${existingUserWithEmail.email} ya está asociado a un Prestador` });
        }

        // Si no se cumplen las condiciones anteriores, crear el nuevo usuario
        const { firstName, lastName, emailAddresses, imageUrl, phoneNumbers, passwordEnabled,
        } = user;
        const passwordValue = passwordEnabled ? 'true' : 'false'; // Convertir el booleano a string
        console.log("Nombre:", firstName);
        console.log("Apellido:", lastName);
        console.log("Imagen de perfil:", imageUrl);
        console.log("Número de teléfono:", phoneNumbers[0].phoneNumber);
        console.log("¿Contraseña habilitada?", passwordEnabled);
        console.log("Valor de la contraseña:", passwordValue);

        const newPrestador = await prisma.prestador.create({
            data: {
                id: userId,
                name: `${firstName}`,
                apellido: `${lastName}`,
                email: emailAddresses[0].emailAddress,
                imageUrl: imageUrl,
                phone: phoneNumbers[0].phoneNumber,
                password: passwordValue,
                matricula: matricula,
                especialidad: especialidad,
                especialidad2:null,
                especialidad3:null,
                phoneOpc:null,
                descripcion:null,
                address:null,
                coordinatesLat:null,
                coordinatesLon:null,
                checkedPhone:false,
             
             
          
            }
        });
        console.log("Perfil de usuario creado correctamente:", newPrestador);

        return NextResponse.json({ status: 200, message: "Perfil del Prestador fue creado con éxito.",newPrestador });
    } catch (error) {
        console.error("Error al crear el perfil del Prestador:", error);
        return NextResponse.json({ status: 500, message: `Error al crear el perfil del Prestador: ${error.message}` });
    }
}





export async function GET(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ status: 407, message: "Prestador no autenticado. Redirigiendo al inicio de sesión." });
        }
        
        // Obtener el ID del usuario autenticado
        const userId = user.id;

        // Verificar si el ID del usuario está en la base de datos
        const isAuthenticatedAndInDatabase = await checkUserAuthentication(userId, 'prestador');
        if (isAuthenticatedAndInDatabase.status === 200) {
            // Obtener toda la información del usuario desde la base de datos
            const users = await prisma.prestador.findMany();

            // Verificar si se encontró la información del usuario
            if (!users) {
                return NextResponse.json({ status: 404, message: "Usuario no encontrado en la base de datos." });
            }

            // Devolver toda la información del usuario
            return NextResponse.json({ status: 200, users });
        } else {
            return NextResponse.json ({ status: 402, message: isAuthenticatedAndInDatabase.message });
        }
    } catch (error) {
        console.error("Error al verificar la autenticación del usuario:", error);
        return NextResponse.json({ status: 500, message: `Error al verificar la autenticación del usuario: ${error.message}` });
    }
}


export async function PUT(request) {
    try {
      const body = await request.json();
      const userId = body.id;
      console.log("id body", userId) // Accedemos al ID del cuerpo de la solicitud
      // Datos a actualizar
      const dataToUpdate = body; // Definimos dataToUpdate con el cuerpo de la solicitud
       console.log(dataToUpdate)
      // Verificar y asignar valores de coordenadas
      let coordinatesLat = null;
      let coordinatesLon = null;
      if (dataToUpdate.addressInfo && dataToUpdate.addressInfo.coordinates) {
        coordinatesLat = dataToUpdate.addressInfo.coordinates.lat;
        coordinatesLon = dataToUpdate.addressInfo.coordinates.lng;
      }
  
      // Definir los datos de actualización con campos que tienen valores definidos en la solicitud
      const updateData = {};
      if (dataToUpdate.especialidad2Seleccionada !== null) {
        updateData.especialidad2 = dataToUpdate.especialidad2Seleccionada;
      }
      if (dataToUpdate.especialidad3Seleccionada !== null) {
        updateData.especialidad3 = dataToUpdate.especialidad3Seleccionada;
      }
      if (dataToUpdate.telefonoPublico !== null) {
        updateData.phoneOpc = dataToUpdate.telefonoPublico;
      }
      if (dataToUpdate.checked !== null) {
        updateData.checkedPhone = dataToUpdate.checked;
      }
      if (dataToUpdate.description !== null) {
        updateData.descripcion = dataToUpdate.description;
      }
      if (dataToUpdate.addressInfo && dataToUpdate.addressInfo.address !== null) {
        updateData.address = dataToUpdate.addressInfo.address;
      }
      if (coordinatesLat !== null) {
        updateData. coordinatesLat = coordinatesLat;
      }
      if (coordinatesLon !== null) {
        updateData.coordinatesLon = coordinatesLon;
      }
  
      // Actualizar el registro del prestador en la base de datos
      const updatedPrestador = await prisma.prestador.update({
        where: { id: userId },
        data: updateData, // Usamos el objeto updateData que contiene solo los campos que tienen valores definidos
      });
  
      // Responder con el prestador actualizado
      return NextResponse.json({ status: 200, message: "Perfil del Prestador fue actualizado con éxito.",updatedPrestador });
    } catch (error) {
      // Manejar errores
      console.error('Error al actualizar el prestador:', error);
      return NextResponse.json({ status: 500, message: `Error al actualizar el prestador: ${error.message}` });
    }
  }
  
  
  
  