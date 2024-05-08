
import "./styles/home.css"
import Navbar from "./components/Navbar/navbar";
import Carousel from "./components/Carousel/Carrusel";


export default function Home() {
  return (
    <main className="container" >
      <div><Navbar/></div>
      <div><Carousel/></div>
      <section className="lines">
       <section className="line"/>
  <div className="line"></div>
  <div className="line"></div>
        </section>
    <div className="wave"></div>
     <div className="wave"></div>
     <div className="wave"></div>
    </main>
  );
}
