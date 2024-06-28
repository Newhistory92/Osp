import { SignIn} from "@clerk/nextjs";
import Image from "next/image";
import fondo from "../../../../../public/fondo.jpeg"

export default function Page() {
  return(
    <main className="relative overflow-hidden min-h-screen">
  <div className="absolute inset-0">
    <Image
      className="w-full h-full object-cover"
      src={fondo}
      alt="background"
      priority

    />
  </div>
  <div className="grid md:grid-cols-2">
    <div className="flex justify-center items-center">
      <div className="container">
      <SignIn fallbackRedirectUrl='/page/select-user'  signUpFallbackRedirectUrl="/"/>;
      </div>
    </div>
    <div className="flex justify-center items-center text-center text-black z-20">
      <div>
        <h1 className="text-red-600 font-bold text-4xl uppercase mb-4 animate-fade-in-left animate-duration-1000 ">
        Obra Social Provincia
        </h1>
        <p className="text-lg md:text-xl mt-4 animate-zoom-in animate-duration-1000 animate-delay-1000">Bienvenido, ya puedes Iniciar Sesion</p>
      </div>
    </div>
  </div>
</main>


) ;

}