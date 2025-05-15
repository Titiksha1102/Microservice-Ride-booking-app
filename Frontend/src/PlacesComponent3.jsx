import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 13.007688329824116,
  lng: 80.22027280178378,
};

const PlacesComponent3 = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY, // Replace with your API key
    libraries: ["places", "geometry"],
  });

  const [map, setMap] = useState(null);
  const [fromPlaces, setFromPlaces] = useState([]);
  const [toPlaces, setToPlaces] = useState([]);
  const [selectedPlaceFrom, setSelectedPlaceFrom] = useState(null);
  const [selectedPlaceTo, setSelectedPlaceTo] = useState(null);
  const [fromInputValue, setFromInputValue] = useState(""); // Stores typed value
  const [toInputValue, setToInputValue] = useState(""); // Stores typed value
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPositionFrom, setMarkerPositionFrom] = useState(null);
  const [markerPositionTo, setMarkerPositionTo] = useState(null);
  const [directions, setDirections] = useState(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  // Reset directions whenever markers change
  useEffect(() => {
    setDirections(null);
  }, [markerPositionFrom, markerPositionTo]);

  const handlePlaceSearchFrom = (event) => {
    const query = event.target.value;
    setFromInputValue(query); // Update input value

    if (isLoaded && map && query) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = { query };
      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setFromPlaces(results);
        } else {
          setFromPlaces([]);
        }
      });
    } else {
      setFromPlaces([]);
    }
  };

  const handlePlaceSearchTo = (event) => {
    const query = event.target.value;
    setToInputValue(query); // Update input value

    if (isLoaded && map && query) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = { query };
      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setToPlaces(results);
        } else {
          setToPlaces([]);
        }
      });
    } else {
      setToPlaces([]);
    }
  };

  const handlePlaceSelectFrom = (place) => {
    setSelectedPlaceFrom(place);
    setFromInputValue(place.name); // Set input value to selected place name
    //diff bet places2 and places3
    setMarkerPositionFrom({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setMapCenter({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setFromPlaces([]); // Clear suggestions
    fromInputRef.current.blur(); // Hide keyboard
  };

  const handlePlaceSelectTo = (place) => {
    setSelectedPlaceTo(place);
    setToInputValue(place.name); // Set input value to selected place name
    setMarkerPositionTo({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setToPlaces([]); // Clear suggestions
    toInputRef.current.blur(); // Hide keyboard
  };

  let distanceKm = null;
  if (selectedPlaceFrom && selectedPlaceTo) {
    const fromLatLng = new window.google.maps.LatLng(
      selectedPlaceFrom.geometry.location.lat(),
      selectedPlaceFrom.geometry.location.lng()
    );
    const toLatLng = new window.google.maps.LatLng(
      selectedPlaceTo.geometry.location.lat(),
      selectedPlaceTo.geometry.location.lng()
    );
    const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
      fromLatLng,
      toLatLng
    );
    distanceKm = (distanceInMeters / 1000).toFixed(2);
  }

  return isLoaded ? (
    <div id="ride-container" className="flex max-w-full h-screen m-3 gap-2">
      <div id="search-panel" className="border-2 border-gray-300 rounded w-[35%] h-full">
        <div id="from-search-box" className="mx-2 mt-5">
          <input
            className="rounded-md bg-gray-300 w-[100%] h-[100%] p-2"
            type="text"
            placeholder="From"
            value={fromInputValue} // Controlled input
            onChange={handlePlaceSearchFrom}
            ref={fromInputRef}
          />
          {fromPlaces.length > 0 && (
            <ul className="z-10 w-full h-auto bg-white border border-gray-300 rounded-md shadow-lg">
              {fromPlaces.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handlePlaceSelectFrom(place)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {place.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div id="to-search-box" className="mx-2 mt-5">
          <input
            className="rounded-md bg-gray-300 w-[100%] h-[100%] p-2"
            type="text"
            placeholder="To"
            value={toInputValue} // Controlled input
            onChange={handlePlaceSearchTo}
            ref={toInputRef}
          />
          {toPlaces.length > 0 && (
            <ul className="z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {toPlaces.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handlePlaceSelectTo(place)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {place.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedPlaceFrom && selectedPlaceTo && (
          <div id="ride-option" className="flex flex-col border-2 border-gray-300 rounded-md p-2 m-2">
            <div className="flex justify-between">
              <span id="vehicle">Car</span>
              <span id="fare">Rs. 200</span>
            </div>
            <div className="flex justify-end">
              <span id="distance">{distanceKm} Km(s)</span>
            </div>
          </div>
        )}
      </div>

      <div id="map-with-dist" className="border-2 border-gray-300 w-[65%]">
        <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12} onLoad={onLoad} onUnmount={onUnmount}>
          {markerPositionFrom && <Marker position={markerPositionFrom} />}
          {markerPositionTo && <Marker position={markerPositionTo} />}
          {/* Calculate and display the driving route */}
                    {markerPositionFrom && markerPositionTo && !directions && (
                      <DirectionsService
                        options={{
                          origin: markerPositionFrom,
                          destination: markerPositionTo,
                          travelMode: window.google.maps.TravelMode.DRIVING,
                        }}
                        callback={(result, status) => {
                          if (status === "OK") {
                            setDirections(result);
                          } else {
                            console.error("Error fetching directions", result);
                          }
                        }}
                      />
                    )}
          
                    {/* Render the calculated route with a highlighted style */}
                    {directions && (
                      <DirectionsRenderer
                        directions={directions}
                        options={{
                          polylineOptions: {
                            strokeColor: "#000000",
                            strokeOpacity: 1.0,
                            strokeWeight: 4,
                          },
                          suppressMarkers: true, // Use our custom markers
                        }}
                      />
                    )}
        </GoogleMap>
      </div>
    </div>
  ) : null;
};

export default React.memo(PlacesComponent3);
