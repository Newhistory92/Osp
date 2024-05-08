"use client"

import { SetStateAction, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: SetStateAction<number>) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel className='' activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img src="https://intef.es/wp-content/uploads/2021/12/32_RED_RRSS_D%C3%ADa-Mundial-de-la-Salud.jpg" alt={''} width={1000} height={300} />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://statics-cuidateplus.marca.com/cms/styles/natural/azblob/salud-cardiovascular-ni%C3%B1os.jpg.webp?itok=n4Gpfjz-" alt={''} width={1000} height={300} />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://defensoria.org.ar/wp-content/uploads/2022/11/salud.webp" alt={''} width={1000} height={300} />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
