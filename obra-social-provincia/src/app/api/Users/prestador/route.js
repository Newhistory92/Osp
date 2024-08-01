import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import prisma from "../../../lib/prisma";
import { checkUserAuthentication } from "../../checkUser/authUtils";


export async function POST(request) {
  try {
      //console.log("Iniciando función POST...");
      const user = await currentUser();
      const body = await request.json();
     // console.log("Cuerpo de la solicitud:", body);

      const matricula = body.matricula;
      const especialidad = body.especialidad;
      const email = user.emailAddresses[0].emailAddress;
      const userId = user.id;
      const address = body.address || null;
      const phoneOpc  = body.phoneOpc || null;
      const name = body.name
      const currentDateTime = new Date().toISOString()
      
    //   console.log("Matrícula:", matricula);
    //   console.log("Especialidad:", especialidad);
    //   console.log("Correo electrónico:", email);
    //   console.log("ID de usuario:", userId);

      // Verificar si el usuario ya está asociado a una cuenta existente
      const isAuthenticated = await checkUserAuthentication(userId, 'prestador');
      console.log(isAuthenticated.status, isAuthenticated.message);
      if (isAuthenticated.status == 200) {
        return NextResponse.json({ status: 404, message: isAuthenticated.message });
    }

      // Verificar si el DNI ya está asociado a un usuario en la base de datos
      const existingUserWithMatricula = await prisma.$queryRaw`
          SELECT * FROM Prestador WHERE matricula = ${matricula}
      `;
      //console.log("Usuario existente con matrícula:", existingUserWithMatricula);

      if (existingUserWithMatricula.length > 0) {
          return NextResponse.json({ status: 400, message: `La Matricula N°: ${existingUserWithMatricula[0].matricula} ya está asociado a un Prestador` });
      }

      // Verificar si el usuario ya existe en la base de datos por su email
      const existingUserWithEmail = await prisma.$queryRaw`
          SELECT * FROM Prestador WHERE email = ${email}
      `;
      //console.log("Usuario existente con correo electrónico:", existingUserWithEmail);

      if (existingUserWithEmail.length > 0) {
          return NextResponse.json({ status: 400, message: `El Correo Electrónico ${existingUserWithEmail[0].email} ya está asociado a un Prestador` });
      }

      // Si no se cumplen las condiciones anteriores, crear el nuevo usuario
      const {  imageUrl, phoneNumbers, passwordEnabled } = user;
      const passwordValue = passwordEnabled ? 'true' : 'false'; // Convertir el booleano a string
  
    //   console.log("Imagen de perfil:", imageUrl);
    //   console.log("Número de teléfono:", phoneNumbers[0].phoneNumber);
    //   console.log("¿Contraseña habilitada?", passwordEnabled);
    //   console.log("Valor de la contraseña:", passwordValue);
    //   console.log("valor del telefono", phoneOpc)

    
      await prisma.$executeRaw`
          INSERT INTO Prestador (id, name, email, imageUrl, phone, phoneOpc,password, matricula, especialidad, address, updatedAt,tipo)
          VALUES (${userId}, ${name}, ${email}, ${imageUrl}, ${phoneNumbers[0].phoneNumber}, ${phoneOpc}, ${passwordValue}, ${matricula}, ${especialidad}, ${address},${currentDateTime}, 'Fidelizado')
      `;
      
      console.log("Perfil de usuario creado correctamente");

      return NextResponse.json({ status: 200, message: "Perfil del Prestador fue creado con éxito." });
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
          const users = await prisma.$queryRaw`
              SELECT * FROM Prestador
          `;
          // Verificar si se encontró la información del usuario
          if (users.length === 0) {
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
     // console.log(userId);

      if (!userId) {
          return NextResponse.json({ status: 400, message: "ID de usuario no proporcionado." });
      }

      // Datos a actualizar
      const dataToUpdate = body;

      // Verificar y asignar valores de coordenadas
      let coordinatesLat = null;
      let coordinatesLon = null;
      if (dataToUpdate.addressInfo && dataToUpdate.addressInfo.coordinates) {
          coordinatesLat = dataToUpdate.addressInfo.coordinates.lat;
          coordinatesLon = dataToUpdate.addressInfo.coordinates.lng;
      }

      // Definir los datos de actualización con campos que tienen valores definidos en la solicitud
      const updateFields = [];
      if (dataToUpdate.especialidad2Seleccionada !== null) {
          updateFields.push(`especialidad2 = '${dataToUpdate.especialidad2Seleccionada}'`);
      }
      if (dataToUpdate.especialidad3Seleccionada !== null) {
          updateFields.push(`especialidad3 = '${dataToUpdate.especialidad3Seleccionada}'`);
      }
      if (dataToUpdate.telefonoPublico !== null) {
          updateFields.push(`phoneOpc = '${dataToUpdate.telefonoPublico}'`);
      }
      if (dataToUpdate.checked !== null) {
          updateFields.push(`checkedPhone = ${dataToUpdate.checked ? 1 : 0}`);
      }
      if (dataToUpdate.description !== null) {
          updateFields.push(`descripcion = '${dataToUpdate.description}'`);
      }
      if (dataToUpdate.addressInfo && dataToUpdate.addressInfo.address !== null) {
          updateFields.push(`address = '${dataToUpdate.addressInfo.address}'`);
      }
      if (coordinatesLat !== null) {
          updateFields.push(`coordinatesLat = ${coordinatesLat}`);
      }
      if (coordinatesLon !== null) {
          updateFields.push(`coordinatesLon = ${coordinatesLon}`);
      }

      // Verificar si updateFields está vacío
      if (updateFields.length === 0) {
          return NextResponse.json({ status: 400, message: "No se proporcionaron datos para actualizar." });
      }

      const updateQuery = `
          UPDATE Prestador
          SET ${updateFields.join(', ')}
          WHERE id = '${userId}'
      `;
      //console.log(updateQuery);

      // Ejecutar la consulta de actualización
      await prisma.$executeRawUnsafe(updateQuery);

      // Responder con el prestador actualizado
      return NextResponse.json({ status: 200, message: "Perfil del Prestador fue actualizado con éxito." });
  } catch (error) {
      // Manejar errores
      console.error('Error al actualizar el prestador:', error);
      return NextResponse.json({ status: 500, message: `Error al actualizar el prestador: ${error.message}` });
  }
}
