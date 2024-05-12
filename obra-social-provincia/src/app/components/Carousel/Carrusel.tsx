'use client'
import Carousel from 'react-bootstrap/Carousel';
import "./Carrusel.css"




function ControlledCarousel() {


  return (
    <Carousel data-bs-theme="dark">
    <Carousel.Item interval={1000}>
      <img src="https://i.pinimg.com/564x/79/69/da/7969da539aa5937622aa1cc9193943d2.jpg" alt={''}  />
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
      <img src="https://i.pinimg.com/564x/2a/67/df/2a67df349af5a38ded2018f391421863.jpg" alt={''}  />
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
      <img src="https://i.pinimg.com/564x/97/cd/ff/97cdff818907968caffe0bf8b977dc20.jpg" alt={''}  />        
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
