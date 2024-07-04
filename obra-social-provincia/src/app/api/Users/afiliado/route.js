
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
        const userId = user.id;
    
     
        // Verificar si el usuario ya está autenticado en alguna tabla
        const isAuthenticated = await checkUserAuthentication(userId, 'afiliado');
        console.log(isAuthenticated.status,isAuthenticated.message )
        if (isAuthenticated === false) {
            return NextResponse.json({ status: 404, message: isAuthenticated.message });
        }

        // Verificar si el DNI ya está asociado a un usuario en la base de datos
        const existingUserWithDNI = await prisma.afiliado.findFirst({
            where: {
                dni: dni
            }
        });

        if (existingUserWithDNI) {
            return NextResponse.json({ status: 400, message: `El DNI N°: ${existingUserWithDNI.dni} ya está asociado a un Afiliado` });
        }

        // Verificar si el usuario ya existe en la base de datos por su email
        const existingUserWithEmail = await prisma.afiliado.findFirst({
            where: {
                email: email
            }
        });

        if (existingUserWithEmail) {
            return NextResponse.json({ status: 400, message: `El Correo Electrónico ${existingUserWithEmail.email} ya está asociado a un Afiliado` });
        }

        // Insertar el nuevo usuario en la base de datos
        const { firstName, lastName, emailAddresses, imageUrl, phoneNumbers, passwordEnabled } = user;
        const passwordValue = passwordEnabled ? 'true' : 'false'; // Convertir el booleano a string
        const newAfiliado = await prisma.afiliado.create({
            data: {
                id: userId,
                name: `${firstName}`,
                apellido: `${lastName}`,
                email: emailAddresses[0].emailAddress,
                imageUrl: imageUrl,
                phone: phoneNumbers[0].phoneNumber,
                password: passwordValue,
                dni: dni,
                dependencia:dependencia,
                address:null,
                coordinatesLat:null,
                coordinatesLon:null,
            }
        });
        
        console.log("Perfil de usuario creado correctamente:", newAfiliado);

        return NextResponse.json({ status: 200, message: "Perfil del Afiliado fue creado con éxito.", newAfiliado });
    } catch (error) {
        console.error("Error al crear el perfil del Afiliado:", error);
        return NextResponse.json({ status: 500, message: `Error al crear el perfil del Afiliado: ${error.message}` });
    }
}

export async function GET(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ status: 407, message: "Afiliado no autenticado. Redirigiendo al inicio de sesión." });
        }
        
        // Obtener el ID del usuario autenticado
        const userId = user.id;
        
        // Verificar si el ID del usuario está en la base de datos
        const isAuthenticatedAndInDatabase = await checkUserAuthentication(userId, 'afiliado');
        if (isAuthenticatedAndInDatabase.status === 200) {
            // Obtener toda la información del usuario desde la base de datos
            const users = await prisma.afiliado.findMany({
                orderBy: { id: 'asc' } 
            });

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
        const user = await currentUser();
        const body = await request.json();
        const motivo = body.motivo;
        const autorId = user.id; // El ID del usuario autenticado
        const matriculaPrestador = body.matriculaPrestador;


        // Verificar si el prestador existe en la base de datos
        const prestador = await prisma.prestador.findUnique({
            where: {
                matricula: matriculaPrestador
            }
        });
        if (!prestador) {
            return NextResponse.json({ status: 404, message: 'Prestador no encontrado' });
        }

        // Crear la nueva denuncia asociada al afiliado y al prestador
        const nuevaDenuncia = await prisma.denuncia.create({
            data: {
                motivo,
                autorId,
                autor: {
                    connect: { id: autorId }
                },
                prestador: {
                    connect: { id: prestador.id }
                }
            }
        });

        console.log("Denuncia creada correctamente:", nuevaDenuncia);

        return NextResponse.json({ status: 200, message: "Denuncia creada exitosamente", nuevaDenuncia });
    } catch (error) {
        console.error("Error al procesar la solicitud PUT:", error);
        return NextResponse.json({ status: 500, message: "Error interno del servidor" });
    }
}


