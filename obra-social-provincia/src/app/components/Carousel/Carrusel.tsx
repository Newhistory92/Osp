'use client'
import Carousel from 'react-bootstrap/Carousel';
import "./Carrusel.css"




function ControlledCarousel() {


  return (
    <Carousel data-bs-theme="dark">
    <Carousel.Item interval={1000}>
      <img src="https://i.pinimg.com/564x/a1/ab/41/a1ab4144dd8d6b5a05da36f82156dbfd.jpg" alt={''}  />
      <Carousel.Caption>
      <div className="header-content">
                        <div className="carousel-line "></div>
                        <h2>Teimagine Digital Experience with</h2>
                        <h1>Start-ups and solutions</h1>
                        <h4>We help entrepreneurs, start-ups and enterprises shape their ideas into products</h4>
                        
                    </div>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item interval={500}>
      <img src="https://i.pinimg.com/564x/43/6d/f0/436df0ed55ec0bfa723a8f12299d2cb1.jpg" alt={''}  />
      <Carousel.Caption>
      <div className="header-content">
                        <div className="carousel-line "></div>
                        <h2>Teimagine Digital Experience with</h2>
                        <h1>Start-ups and solutions</h1>
                        <h4>We help entrepreneurs, start-ups and enterprises shape their ideas into products</h4>
                        
                    </div>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img src="https://i.pinimg.com/736x/b4/57/17/b457174d0d1634bde68e79e08473f41f.jpg" alt={''}  />        
      <Carousel.Caption>
      <div className="header-content">
                        <div className="carousel-line "></div>
                        <h2>Teimagine Digital Experience with</h2>
                        <h1>Start-ups and solutions</h1>
                        <h4>We help entrepreneurs, start-ups and enterprises shape their ideas into products</h4>
                        
                    </div>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
   
  );

}


export default ControlledCarousel;
