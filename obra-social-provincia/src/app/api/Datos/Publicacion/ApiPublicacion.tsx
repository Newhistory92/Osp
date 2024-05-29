import { NuevaPublicacion } from "@/app/interfaces/interfaces";

const crearPublicacion = async (nuevaPublicacion: NuevaPublicacion) => {
  const response = await fetch('/api/Publicaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevaPublicacion),
  });

  if (!response.ok) {
    throw new Error('Error al crear la publicación: ' + response.statusText);
  }

  const responseData = await response.json();
  return responseData;
};


const actualizarPublicacion = async (id: number, datosActualizados: { titulo: string; contenido: string; }) => {
  try {
 
    const response = await fetch(`/api/Publicaciones`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...datosActualizados }),
    });
    const responseData = await response.json();
    console.log('Respuesta del backend:', responseData);
    if (responseData.status === 200) {

    }
  } catch (error) {
    console.error('Error al actualizar la publicación:', error);
  }
};

const deletePublicacion = async (id: number) => {
  try {
      const response = await fetch(`/api/Publicaciones`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
      });
      const responseData = await response.json();
      console.log('Respuesta del backend:', responseData);
      if (responseData.status === 200) {
       
      }
  } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      throw error;
  }
};

  
export { crearPublicacion, actualizarPublicacion, deletePublicacion };
