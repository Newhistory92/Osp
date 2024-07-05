import prisma from "../../lib/prisma"



export async function checkUserAuthentication(userId, context) {
    try {
        const existingAfiliado = await prisma.$queryRaw`SELECT * FROM afiliado WHERE id = ${userId}`;
        const existingPrestador = await prisma.$queryRaw`SELECT * FROM prestador WHERE id = ${userId}`;
        const existingOperador = await prisma.$queryRaw`SELECT * FROM operador WHERE id = ${userId}`;

        if (existingAfiliado.length && context === 'afiliado') {
            return { status: 200, message: `El Afiliado ${existingAfiliado[0].name} ya tiene una cuenta asociada como Afiliado.` };
        } else if (existingPrestador.length && context === 'prestador') {
            return { status: 200, message: `El Prestador ${existingPrestador[0].name} ya tiene una cuenta asociada como Prestador.` };
        } else if (existingOperador.length && context === 'operador') {
            return { status: 200, message: `El Operador ${existingOperador[0].name} ya tiene una cuenta asociada como Operador.` };
        } else {
            return { status: 400, message: `El usuario no está en ninguna tabla.` };
        }
    } catch (error) {
        console.error("Error al verificar la autenticación del usuario:", error);
        return { status: 500, message: `Error al verificar la autenticación del usuario: ${error.message}` };
    }
}
