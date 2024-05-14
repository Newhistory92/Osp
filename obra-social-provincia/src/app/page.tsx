
import "./styles/home.css"
import Navbar from "./components/Navbar/navbar";
import Carrusel from "./components/Carousel/Carrusel"
import Contenido from "./components/Contenido/Contenido";
import CardMenu from "./components/CardMenu/CardMenu";

export default function Home() {
  return (
    <main className="container-home" >
      <div><Navbar/></div>
      <div><Carrusel/></div>
      <div> <Contenido/></div>
      <div>< CardMenu /></div>
      <div></div>
      <div></div>
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
