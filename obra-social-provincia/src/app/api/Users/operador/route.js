
import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import prisma from "../../../lib/prisma";
import { checkUserAuthentication } from "../../checkUser/authUtils";

export async function POST(request) {
    try {
        const user = await currentUser();
        const body = await request.json();
        const numeroOperador = body.numeroOperador;
        const email = user.emailAddresses[0].emailAddress;
        const userId = user.id;
      console.log( numeroOperador)
        const isAuthenticated = await checkUserAuthentication(userId, 'operador');
        console.log(isAuthenticated.status, isAuthenticated.message);
        if (isAuthenticated.status == 200) {
            return NextResponse.json({ status: 404, message: isAuthenticated.message });
        }

        const existingUserWithOPer = await prisma.$queryRaw`SELECT * FROM operador WHERE numeroOperador = ${numeroOperador}`;
        if (existingUserWithOPer.length) {
            return NextResponse.json({ status: 400, message: `El Operador N°: ${existingUserWithOPer[0].numeroOperador} ya está asociado a un Afiliado` });
        }

        const existingUserWithEmail = await prisma.$queryRaw`SELECT * FROM operador WHERE email = ${email}`;
        if (existingUserWithEmail.length) {
            return NextResponse.json({ status: 400, message: `El Correo Electrónico ${existingUserWithEmail[0].email} ya está asociado a un Afiliado` });
        }

        const { firstName, lastName, imageUrl, phoneNumbers, passwordEnabled } = user;
        const passwordValue = passwordEnabled ? 'true' : 'false';
        const currentDateTime = new Date().toISOString()
        const newOperador = await prisma.$executeRaw`
            INSERT INTO operador (id, name, apellido, email, imageUrl, phone, password, numeroOperador, updatedAt )
            VALUES (${userId}, ${firstName}, ${lastName}, ${email}, ${imageUrl}, ${phoneNumbers[0].phoneNumber}, ${passwordValue}, ${numeroOperador},${currentDateTime})
        `;
        
        console.log("Perfil de usuario creado correctamente:", newOperador);

        return NextResponse.json({ status: 200, message: "Perfil del Operador fue creado con éxito.", newOperador });
    } catch (error) {
        console.error("Error al crear el perfil del Operador:", error);
        return NextResponse.json({ status: 500, message: `Error al crear el perfil del Operador: ${error.message}` });
    }
}


export async function GET(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ status: 401, message: "Operario no autenticado. Redirigiendo al inicio de sesión." });
        }
        
        // Obtener el ID del usuario autenticado
        const userId = user.id;

        // Verificar si el ID del usuario está en la base de datos
        const isAuthenticatedAndInDatabase = await checkUserAuthentication(userId, 'operador');
        if (isAuthenticatedAndInDatabase.status === 200) {
            const users = await prisma.operador.findMany({
                orderBy: { id: 'asc' } 
            });
            if (!users) {
                return NextResponse.json({ status: 404, message: "Usuario no encontrado en la base de datos." });
            }
            return NextResponse.json({ status: 200, users });
        } else {
            return NextResponse.json ({ status: 402, message: "Operador no encontrado en la base de datos." });
        }
    } catch (error) {
        console.error("Error al verificar la autenticación del usuario:", error);
        return NextResponse.json({ status: 500, message: `Error al verificar la autenticación del usuario: ${error.message}` });
    }
}




