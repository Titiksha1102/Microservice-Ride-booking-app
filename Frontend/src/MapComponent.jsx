import React, { useState } from "react";
import { APIProvider, 
    Map, 
    AdvancedMarker, 
    useMapsLibrary } from "@vis.gl/react-google-maps";

const apiKey = ""; // Replace with your API Key
try {
  
} catch (error) {
  
}
function MapComponent() {
  const [center, setCenter] = useState({ lat: 53.54, lng: 10 }); // Default Location
  const [input, setInput] = useState("");
  const places = useMapsLibrary("places"); // Load the Places library
  console.log(places);
  const handlePlaceSelect = async () => {
    console.log("handlePlaceSelect called");
    try {
        if (!places) return;

        const service = new google.maps.places.AutocompleteService();

        service.getPlacePredictions({ input }, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions.length > 0) {
                const placeId = predictions[0].place_id;

                const placesService = new google.maps.places.PlacesService(document.createElement("div"));
                placesService.getDetails({ placeId }, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const location = place.geometry.location;
                        setCenter({ lat: location.lat(), lng: location.lng() });
                        console.log("Coordinates:", location.lat(), location.lng());
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
    }
    
  };

  return (
    <APIProvider apiKey="AIzaSyBCIp7JfZkdYNu6v1V-5F7tlcVPpXNmMDg">
      <div style={{ padding: "10px",height: '100vh', width: '100vw'}}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a place..."
          style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
        />
        <button onClick={handlePlaceSelect} style={{ padding: "10px", marginLeft: "10px" }}>
          Search
        </button>
        <Map
            center={center}
            zoom={12}
            mapContainerStyle={{ height: "100vh", width: "100vw" ,border: "2px solid black"}}
            mapId="b648e36a0c96746">
            <AdvancedMarker position={center} />
        </Map>
      </div>
      
    </APIProvider>
  );
}

export default MapComponent;
