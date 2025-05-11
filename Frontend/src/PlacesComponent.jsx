import React, { useState, useCallback } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "300px",
};

const defaultCenter = {
  lat: 13.007688329824116, // Default (San Francisco)
  lng: 80.22027280178378,
};

const PlacesComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBCIp7JfZkdYNu6v1V-5F7tlcVPpXNmMDg",
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [placesFrom, setPlacesFrom] = useState([]);
  const [placesTo, setPlacesTo] = useState([]);
  const [selectedPlaceFrom, setSelectedPlaceFrom] = useState(null);
  const [selectedPlaceTo, setSelectedPlaceTo] = useState(null);
  const [mapCenterFrom, setMapCenterFrom] = useState(defaultCenter);
  const [mapCenterTo, setMapCenterTo] = useState(defaultCenter);
  const [markerPositionFrom, setMarkerPositionFrom] = useState(null);
  const [markerPositionTo, setMarkerPositionTo] = useState(null);

  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const handlePlaceSearchFrom = (event) => {
    if (isLoaded && map) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = { query: event.target.value };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlacesFrom(results);
          if (results.length > 0) {
            const firstPlace = results[0];
            setMapCenterFrom({
              lat: firstPlace.geometry.location.lat(),
              lng: firstPlace.geometry.location.lng(),
            });
            setMarkerPositionFrom({
              lat: firstPlace.geometry.location.lat(),
              lng: firstPlace.geometry.location.lng(),
            });
          }
        } else {
          console.error("Places API Error:", status);
        }
      });
    }
  };
  const handlePlaceSearchTo = (event) => {
    if (isLoaded && map) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = { query: event.target.value };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlacesTo(results);
          if (results.length > 0) {
            const firstPlace = results[0];
            setMapCenterFrom({
              lat: firstPlace.geometry.location.lat(),
              lng: firstPlace.geometry.location.lng(),
            });
            setMarkerPositionTo({
              lat: firstPlace.geometry.location.lat(),
              lng: firstPlace.geometry.location.lng(),
            });
          }
        } else {
          console.error("Places API Error:", status);
        }
      });
    }
  };
  const handlePlaceSelectFrom = (place) => {
    setSelectedPlaceFrom(place);
    setMapCenterFrom({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setMarkerPositionFrom({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };
  const handlePlaceSelectTo = (place) => {
    setSelectedPlaceTo(place);
    
    setMarkerPositionTo({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };
  return isLoaded ? (
    <div>
      <input type="text" placeholder="From" onChange={handlePlaceSearchFrom} />
      <ul>
        {placesFrom.map((place) => (
          <li key={place.place_id} onClick={() => handlePlaceSelectFrom(place)}>
            {place.name}
          </li>
        ))}
      </ul>
      <input type="text" placeholder="To" onChange={handlePlaceSearchTo} />
      <ul>
        {placesTo.map((place) => (
          <li key={place.place_id} onClick={() => handlePlaceSelectTo(place)}>
            {place.name}
          </li>
        ))}
      </ul>
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenterFrom}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {markerPositionFrom && <Marker position={markerPositionFrom} />}
          {markerPositionTo && <Marker position={markerPositionTo} />}
        </GoogleMap>
      </div>
      {selectedPlaceFrom && (
        <div>
          <h2>{selectedPlaceFrom.name}</h2>
        </div>
      )}
      {selectedPlaceTo && (
        <div>
          <h2>{selectedPlaceTo.name}</h2>
        </div>
      )}
    </div>
  ) : null;
};

export default React.memo(PlacesComponent);
