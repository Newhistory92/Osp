"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ButtomMap";
import { Loader } from "@googlemaps/js-api-loader";

interface MapComponentProps {
  closeModal: (fromSelected: google.maps.LatLngLiteral) => Promise<void>;
  closeMapModal: () => void;
}

function MapComponent(props: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();
  const [selectedPos, setSelectedPos] =
    useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyCLn_I4rgobIL5FgrHVHeLdL_mwsqBU5XQ",
        version: "weekly",
        libraries: ["places"],
      });

      const { Map } = await loader.importLibrary("maps");

      // Obtener la geoposición actual
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // Configurar opciones del mapa con la geoposición actual
            const mapOptions: google.maps.MapOptions = {
              center: userPosition,
              zoom: 15,
              mapId: "cesar-map",
            };

            // Crear el mapa
            const newMap = new Map(
              mapRef.current as HTMLDivElement,
              mapOptions
            );
            setMap(newMap);

            // Configurar autocompletado
            const autocomplete = new google.maps.places.Autocomplete(
              inputRef.current as HTMLInputElement
            );
            autocomplete.setFields(["formatted_address", "geometry"]);
            autocompleteRef.current = autocomplete;

            // Esperar a que el mapa se cargue completamente antes de ajustar la posición
            await new Promise((resolve) => {
              google.maps.event.addListenerOnce(newMap, "idle", resolve);
            });

            // Ajustar la posición del mapa después de que esté completamente cargado
            newMap.setCenter(userPosition);
          },
          (error) => {
            console.error("Error obteniendo la geoposición:", error);
          }
        );
      } else {
        console.error("El navegador no soporta la geolocalización.");
      }
    };

    loadMap();
  }, []);

  const handleSearch = () => {
    const place = autocompleteRef.current?.getPlace();

    if (place && place.geometry && map) {
      const location = place.geometry.location;
      map.setCenter(location!.toJSON());

      // Colocar un marcador en la posición seleccionada
      const marker = new google.maps.Marker({
        position: location?.toJSON(),
        map,
        title: place.formatted_address,
      });
   

      // Guardar la posición seleccionada en el estado
      setSelectedPos(location!.toJSON());

      // Llamar a props.closeModal con la última posición seleccionada
      setTimeout(() => {
        const pos = location?.toJSON();
        props.closeModal(pos!);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col rounded bg-gray-800 border-r-1 border-gray-800 ">
      <Button onClick={props.closeMapModal} variant={"default"}>
      <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
</svg>
      </Button>
      <div style={{ height: "600px" }} ref={mapRef} />
      <div className="p-2 mx-auto">
        <input
          className="p-2 bg-slate-200 rounded"
          type="text"
          placeholder="Ingrese una dirección"
          ref={inputRef}
        />
        <button
          className= "rounded mx-4 text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium  text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
          onClick={handleSearch}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default MapComponent;
