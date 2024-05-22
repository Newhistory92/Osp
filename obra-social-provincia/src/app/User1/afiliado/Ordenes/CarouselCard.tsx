import { Carousel } from "@material-tailwind/react";
import Orden from "./OrdenCard"; // Asegúrate de importar el componente Orden desde la ubicación correcta


interface OrdenData {
  numeroOrden: number;
  fechaUso: string;
  nombreMedico: string;
  apellidoMedico: string;
  especialidad: string;
  nombreAfiliado:string;
  numeroPrestador:number;
  tipoBono:string
}

interface Props {
  ordenes: OrdenData[];
}

export function CarouselDefault({ ordenes }: Props) {
    // Ordenar las órdenes por fecha de uso de la más reciente a la más antigua antes de renderizarlas
    const ordenesOrdenadas = ordenes.slice().sort((a, b) => {
      // Convertir las fechas de uso a objetos Date para compararlas
      const fechaA = new Date(a.fechaUso).getTime();
      const fechaB = new Date(b.fechaUso).getTime();
      // Invertir el orden para que la más reciente esté primero
      return fechaB - fechaA;
    });
  
    return (
      <Carousel className="rounded-xl duration-700" style={{ width: '1000px', height: '600px' }}>
        {ordenesOrdenadas.map((orden, index) => (
          <div key={index} className=" grid h-full inset-0  place-items-center bg-black/75">
            <Orden
              numeroOrden={orden.numeroOrden}
              fechaUso={orden.fechaUso}
              nombreMedico={orden.nombreMedico}
              apellidoMedico={orden.apellidoMedico}
              especialidad={orden.especialidad} 
              nombreAfiliado={orden.nombreAfiliado}
              numeroPrestador={orden.numeroPrestador}
              tipoBono={orden.tipoBono} />
          </div>
        ))}
      </Carousel>
    );
  }
  

