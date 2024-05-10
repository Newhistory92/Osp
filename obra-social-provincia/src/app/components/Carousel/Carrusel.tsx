'use client'
import Carousel from 'react-bootstrap/Carousel';
import "./Carrusel.css"




function ControlledCarousel() {


  return (
    <Carousel data-bs-theme="dark">
    <Carousel.Item interval={1000}>
      <img src="https://i.pinimg.com/564x/79/69/da/7969da539aa5937622aa1cc9193943d2.jpg" alt={''}  />
      <Carousel.Caption>
                <h2>Third slide label</h2>
                <h1>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</h1>
                <h4></h4>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item interval={500}>
      <img src="https://i.pinimg.com/564x/2a/67/df/2a67df349af5a38ded2018f391421863.jpg" alt={''}  />
      <Carousel.Caption>
        <h3>Second slide label</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img src="https://i.pinimg.com/564x/97/cd/ff/97cdff818907968caffe0bf8b977dc20.jpg" alt={''}  />        
      <Carousel.Caption>
        <h3>Third slide label</h3>
        <p>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur.
        </p>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
   
  );
}

export default ControlledCarousel;
