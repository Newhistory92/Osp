import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { userId } = req.body;
  
      if (userId) {
        // Busca el usuario en las tablas Afiliado, Prestador y Operador
        const [afiliado, prestador, operador] = await Promise.all([
          prisma.afiliado.findUnique({ where: { id: userId }, select: { role: true } }),
          prisma.prestador.findUnique({ where: { id: userId }, select: { role: true } }),
          prisma.operador.findUnique({ where: { id: userId }, select: { role: true } }),
        ]);
  
        const userRole = afiliado?.role || prestador?.role || operador?.role;
  
        if (userRole) {
          // Usa la API de Clerk para actualizar los claims del usuario
          await fetch(`https://api.clerk.dev/v1/users/${userId}/metadata`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.CLERK_API_KEY}`, // Asegúrate de tener esta variable de entorno configurada
            },
            body: JSON.stringify({
              public_metadata: {
                role: userRole,
              },
            }),
          });
  
          return res.status(200).json({ message: 'User role updated successfully' });
        }
      }
  
      return res.status(400).json({ message: 'Invalid request' });
    }
  
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }