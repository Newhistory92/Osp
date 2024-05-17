import prisma from "../../lib/prisma"







export async function checkUserAuthentication(userId, context) {
    try {
        // Verificar si el ID del usuario está en la tabla Afiliado
        const existingAfiliado = await prisma.afiliado.findFirst({
            where: {
                id: userId
            }
        });

        // Verificar si el ID del usuario está en la tabla Prestador
        const existingPrestador = await prisma.prestador.findFirst({
            where: {
                id: userId
            }
        });

        // Verificar si el ID del usuario está en la tabla Operador
        const existingOperador = await prisma.operador.findFirst({
            where: {
                id: userId
            }
        });

        // Determinar si el usuario está autenticado en alguna tabla
        if (existingAfiliado && context === 'afiliado') {
            return { status: 200, message: `El Afiliado ${existingAfiliado.name} ya tiene una cuenta asociada como Afiliado.` };
        } else if (existingPrestador && context === 'prestador') {
            return { status: 200, message: `El Prestador ${existingPrestador.name} ya tiene una cuenta asociada como Prestador.` };
        } else if (existingOperador && context === 'operador') {
            return { status: 200, message: `El Operador ${existingOperador.name} ya tiene una cuenta asociada como Operador.` };
        } else {
            return { status: 400, message: `El usuario no está en ninguna tabla.` };
        }
    } catch (error) {
        console.error("Error al verificar la autenticación del usuario:", error);
        return { status: 500, message: `Error al verificar la autenticación del usuario: ${error.message}` };
    }
}

