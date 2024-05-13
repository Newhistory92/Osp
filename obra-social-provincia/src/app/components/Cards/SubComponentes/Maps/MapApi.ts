



type myLocation = {
    lat: number;
    lng: number;
  };
  
  export const getFormattedAddress = async (location: myLocation) => {
    const apiKey = "AIzaSyCLn_I4rgobIL5FgrHVHeLdL_mwsqBU5XQ"; // Reemplaza con tu clave de API de Google Maps
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`;
    try {
      const response = await fetch(apiUrl);
 
      const data = await response.json();
      // console.log("Data received:", data);
      const results = data.results[0].formatted_address;
      const coordinates = data.results[0].geometry.location;
      if (results && results.length > 0) {
        // console.log("Address found:", results, coordinates);
        return {results, coordinates}
      } else {

        return "No se encontró ninguna dirección para la geoposición proporcionada.";
      }
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
      return "Error al obtener la dirección.";
    }
  }; 