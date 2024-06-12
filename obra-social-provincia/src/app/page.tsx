
import "./styles/home.css"
import dynamic from 'next/dynamic';
import Navbar from "./components/Navbar/navbar";
import Carrusel from "./components/Carousel/Carrusel"
import CardMenu from "./components/CardMenu/CardMenu";
import Statistic from "./components/Statistic/Statistic";
import Footer from "./components/Footer/Footer";
const DynamicContenido = dynamic(() => import('./components/Contenido/Contenido'));

export default function Home() {
  return (
    <main className="container-home" >
      <div><Navbar/></div>
      <div><Carrusel/></div>
      <div> <DynamicContenido /></div>
      <div>< CardMenu /></div>
      <div><Statistic/></div>
      <div><Footer/></div>
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
