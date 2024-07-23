import { Carousel } from "@material-tailwind/react";
import Orden from "./OrdenCard"; // Asegúrate de importar el componente Orden desde la ubicación correcta
import { OrdenData } from '@/app/interfaces/interfaces';


interface Props {
  ordenesData: OrdenData[];
}

export function CarouselDefault({ ordenesData }: Props) {
  
    return (
      <Carousel className="rounded-xl duration-700" style={{ width: '1000px', height: '600px' }}>
        {ordenesData && ordenesData.map((orden, index) => ( 
          <div key={index} className="grid h-full inset-0 place-items-center bg-black/75">
            <Orden
              IdFacturacion={orden.IdFacturacion}
              Numero={orden.Numero}
              FechaEfectua={orden.FechaEfectua}
              NombreEfector={orden.NombreEfector}
              EspecialidadEfector={orden.EspecialidadEfector} 
              Nombre={orden.Nombre}
              Cantidad={orden.Cantidad}
              NombrePractica={orden.NombrePractica}
              Efector={orden.Efector}
            />
          </div>
        ))}
      </Carousel>
    );
}