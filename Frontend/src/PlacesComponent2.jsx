import React, { useState, useCallback, useEffect,useRef } from "react";
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

const PlacesComponent2 = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBCIp7JfZkdYNu6v1V-5F7tlcVPpXNmMDg", // Replace with your API key
    libraries: ["places", "geometry"],
  });

  const [map, setMap] = useState(null);
  const [fromPlaces, setFromPlaces] = useState([]);
  const [toPlaces, setToPlaces] = useState([]);
  const [selectedPlaceFrom, setSelectedPlaceFrom] = useState(null);
  const [selectedPlaceTo, setSelectedPlaceTo] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPositionFrom, setMarkerPositionFrom] = useState(null);
  const [markerPositionTo, setMarkerPositionTo] = useState(null);
  const [directions, setDirections] = useState(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const [fromInput, setFromInput] = useState(""); 
  const [toInput, setToInput] = useState("");
  

  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  // Reset directions whenever markers change
  useEffect(() => {
    setDirections(null);
  }, [markerPositionFrom, markerPositionTo]);
  useEffect( ()=>{
    async function fetch_directions() {
      const directionsService = new window.google.maps.DirectionsService()
      const results = await directionsService.route({
        origin: markerPositionFrom,
        destination: markerPositionTo,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      })
    setDirections(results)
    }
    if (markerPositionFrom && markerPositionTo) { // Add conditional check
      fetch_directions()
    } else {
      setDirections(null); // Reset directions if markers are not both set.
    }
  },[markerPositionFrom, markerPositionTo])
  const handlePlaceSearchFrom = (event) => {
    const query = event.target.value;
    setFromInput(query); // Update input field state
    if (isLoaded && map && query) {
      const service = new google.maps.places.PlacesService(map);
      const request = { query };
      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setFromPlaces(results);
        } else {
          console.error("Places API Error (From):", status);
        }
      });
    } else {
      setFromPlaces([]);
    }
  };

  const handlePlaceSearchTo = (event) => {
    const query = event.target.value;
    setToInput(query); // Update input field state
    if (isLoaded && map && query) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = { query };
      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setToPlaces(results);
        } else {
          console.error("Places API Error (To):", status);
        }
      });
    } else {
      setToPlaces([]);
    }
  };

  const handlePlaceSelectFrom = (place) => {
    setSelectedPlaceFrom(place);
    setFromInput(place.name); // Set input field to selected place name
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setMapCenter({ lat, lng });
    setMarkerPositionFrom({ lat, lng });
    setFromPlaces([]); // Clear suggestions after selection
    fromInputRef.current.blur(); // Blur the input to hide the dropdown
  };

  const handlePlaceSelectTo = (place) => {
    setSelectedPlaceTo(place);
    setToInput(place.name); // Set input field to selected place name
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setMarkerPositionTo({ lat, lng });
    setToPlaces([]); // Clear suggestions after selection
    toInputRef.current.blur(); // Blur the input to hide the dropdown
  };
  useEffect(() => {
    const handleBlurFrom = () => {
      setShowFromDropdown(false);
    };

    const handleBlurTo = () => {
      setShowToDropdown(false);
    };


    if (fromInputRef.current) {
      fromInputRef.current.addEventListener("blur", handleBlurFrom);
    }

    if (toInputRef.current) {
      toInputRef.current.addEventListener("blur", handleBlurTo);
    }

    return () => {
      if (fromInputRef.current) {
        fromInputRef.current.removeEventListener("blur", handleBlurFrom);
      }
      if (toInputRef.current) {
        toInputRef.current.removeEventListener("blur", handleBlurTo);
      }
    };
  }, []);
  // Calculate distance (in km) if both locations are selected
  let distanceKm = null;
  if (selectedPlaceFrom && selectedPlaceTo) {
    const fromLatLng = new google.maps.LatLng(
      selectedPlaceFrom.geometry.location.lat(),
      selectedPlaceFrom.geometry.location.lng()
    );
    const toLatLng = new google.maps.LatLng(
      selectedPlaceTo.geometry.location.lat(),
      selectedPlaceTo.geometry.location.lng()
    );
    const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
      fromLatLng,
      toLatLng
    );
    distanceKm = (distanceInMeters / 1000).toFixed(2);
  }
  function clearDirections(){
    console.log(directions)
    console.log("clearing directions")
    setDirections(null)
    console.log(directions)
  }
  return isLoaded ? (
    <div id="ride-container" className="flex max-w-full h-screen m-3 gap-2">
      <div id="search-panel" className="border-2 border-gray-300 rounded w-[35%] h-full">
        <div id="from-search-box" className="mx-2 mt-5">
        <input
          className="rounded-md bg-gray-300 w-[100%] h-[100%] p-2"
          type="text"
          placeholder="From"
          onChange={handlePlaceSearchFrom}
          value={fromInput} // Use input state
          ref={fromInputRef} // Add the ref
        />
          {fromPlaces.length > 0 && ( // Show only if there are results
          <ul className="z-10 w-full h-auto bg-white border border-gray-300 rounded-md shadow-lg" style={{ listStyle: "none", padding: 0}}>
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
          onChange={handlePlaceSearchTo}
          value={toInput} // Use input state
          ref={toInputRef} // Add the ref
        />
        {toPlaces.length > 0 && ( // Show only if there are results
          <ul className="z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg" style={{ listStyle: "none", padding: 0}}>
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
        
        <div id="ride-options">
          {selectedPlaceFrom && selectedPlaceTo && (
            <div id="ride-option" className="flex flex-col border-2 border-gray-300 rounded-md p-2 m-2">
              <div class="flex justify-between">
                <span id="vehicle">Car</span>
                <span id="fare">Rs. 200</span>
              </div>
              <div class="flex justify-end">
                <span id="distance">{distanceKm} Km(s)</span>
              </div>

            </div>
          )}
        </div>
        <button onClick={clearDirections} className="border-2 border-black">clear directions</button>
      </div>
      <div id="map-with-dist"
      className="border-2 border-gray-300 w-[65%]" 
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {markerPositionFrom && <Marker position={markerPositionFrom} />}
          {markerPositionTo && <Marker position={markerPositionTo} />}

          

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

export default React.memo(PlacesComponent2);
