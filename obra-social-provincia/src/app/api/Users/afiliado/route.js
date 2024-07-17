
import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import prisma from "../../../lib/prisma";
import { checkUserAuthentication } from "../../checkUser/authUtils";


export async function POST(request) {
    try {
        const user = await currentUser();
        const body = await request.json();
        const dni = body.dni;
        const dependencia = body.dependencia;
        const email = user.emailAddresses[0].emailAddress;
        const currentDateTime = new Date().toISOString()
        const userId = user.id;
        const name= body.name
     
        // Verificar si el usuario ya está autenticado en alguna tabla
        const isAuthenticated = await checkUserAuthentication(userId, 'afiliado');
        console.log(isAuthenticated.status,isAuthenticated.message )
        if (isAuthenticated.status == 200) {
            return NextResponse.json({ status: 404, message: isAuthenticated.message });
        }

        // Verificar si el usuario ya existe en la base de datos por su email
      const existingUserWithEmail = await prisma.$queryRaw`
      SELECT * FROM Afiliado WHERE email = ${email}
  `;
  console.log("Usuario existente con correo electrónico:", existingUserWithEmail);

  if (existingUserWithEmail.length > 0) {
      return NextResponse.json({ status: 400, message: `El Correo Electrónico ${existingUserWithEmail[0].email} ya está asociado a un Prestador` });
  }

   // Insertar el nuevo usuario en la base de datos
   const { emailAddresses, imageUrl, phoneNumbers, passwordEnabled } = user;
   const passwordValue = passwordEnabled ? 'true' : 'false'; // Convertir el booleano a string
   await prisma.$executeRaw`
       INSERT INTO Afiliado (id, name, email, imageUrl, phone, password, dni, dependencia, address, coordinatesLat, coordinatesLon,updatedAt)
       VALUES (${userId}, ${name}, ${emailAddresses[0].emailAddress}, ${imageUrl}, ${phoneNumbers[0].phoneNumber}, ${passwordValue}, ${dni}, ${dependencia}, NULL, NULL, NULL,${currentDateTime})
   `;
   
   const newAfiliado = await prisma.$queryRaw`
       SELECT * FROM Afiliado WHERE id = ${userId}
   `;
 
 console.log("Perfil de usuario creado correctamente:", newAfiliado[0]);

 return NextResponse.json({ status: 200, message: "Perfil del Afiliado fue creado con éxito.", newAfiliado: newAfiliado[0] });
} catch (error) {
 console.error("Error al crear el perfil del Afiliado:", error);
 return NextResponse.json({ status: 500, message: `Error al crear el perfil del Afiliado: ${error.message}` });
}
}





export async function GET(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ status: 401, message: "Afiliado no autenticado. Redirigiendo al inicio de sesión." });
        }
        const userId = user.id;
        // Verificar si el ID del usuario está en la base de datos
        const isAuthenticatedAndInDatabase = await checkUserAuthentication(userId, 'afiliado');
        if (isAuthenticatedAndInDatabase.status === 200) {
            const users = await prisma.$queryRaw`
                SELECT * FROM Afiliado
            `;
            if (users.length === 0) {
                return NextResponse.json({ status: 404, message: "Usuario no encontrado en la base de datos." });
            }
            return NextResponse.json({ status: 200, users });
        } else {
            return NextResponse.json ({ status: 402, message: "Afiliado no encontrado en la base de datos." });
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
        console.log(userId);
  
        if (!userId) {
            return NextResponse.json({ status: 400, message: "ID de usuario no proporcionado." });
        }
  
        // Datos a actualizar
        const dataToUpdate = body;

       
  
        // Definir los datos de actualización con campos que tienen valores definidos en la solicitud
        const updateFields = [];
        
        if (dataToUpdate.addressInfo && dataToUpdate.addressInfo.address !== null) {
            updateFields.push(`address = '${dataToUpdate.addressInfo.address}'`);
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
        console.log(updateQuery);
  
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
  