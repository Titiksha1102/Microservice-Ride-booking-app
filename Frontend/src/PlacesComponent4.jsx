
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from '@react-google-maps/api'
import axios from 'axios';
import { useContext, useRef, useState } from 'react'
import { UserContext } from "./contexts/UserContext"

const libraries = ["places", "geometry"];
const PlacesComponent4 = () => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY, // Replace with your API key
        libraries: libraries,
    });
    const center = {
        lat: 13.007688329824116,
        lng: 80.22027280178378,
    };
    const [map, setMap] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [rideOpt, setRideOpt] = useState(null)

    const originRef = useRef()

    const destinationRef = useRef()
    const context=useContext(UserContext)
    async function getCoordinatesFromAddress(addressInput) {
        const geocoder = new window.google.maps.Geocoder();
    
        const locationObj = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: addressInput }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    const location = results[0].geometry.location;
                    resolve({
                        latitude: location.lat(),
                        longitude: location.lng()
                    });
                } else {
                    reject(new Error("Geocoding failed: " + status));
                }
            });
        });
    
        return locationObj;
    }
    
    function getLocationName(location) {
        if (!location || !location.lat || !location.lng) {
            console.error("Invalid location object");
            return;
        }

        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(location.lat, location.lng);

        geocoder.geocode({ location: latlng }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    console.log(results)

                } else {
                    console.log("No results found");
                }
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });
    }
    async function publishRide() {
        const latlongOrigin = await getCoordinatesFromAddress(originRef.current.value)
        const latlongDestination=await getCoordinatesFromAddress(destinationRef.current.value)
        const response = await axios.post(
            'http://localhost:4003/ride/createRide',
            {
              pickup: latlongOrigin,
              drop: latlongDestination
            },
            {
              headers: {
                Authorization: `Bearer ${context.accessToken}`
              }
            }
          );
          
        console.log(response)
    }
    async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
            return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        })
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }
    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }
    return isLoaded ? (
        <div id="ride-container" className="flex max-w-full h-screen m-3 gap-2">
            <div id="search-panel" className="border-2 border-gray-300 rounded w-[35%] h-full">
                <div id="from-search-box" className="mx-2 mt-5" >
                    <Autocomplete>
                        <input
                            type="text"
                            placeholder="From"
                            ref={originRef}
                            className="rounded-md bg-gray-300 w-[100%] h-[100%] p-2" />
                    </Autocomplete>
                </div>
                <div id="to-search-box" className="mx-2 mt-5">
                    <Autocomplete>
                        <input
                            type="text"
                            placeholder="To"
                            ref={destinationRef}
                            className="rounded-md bg-gray-300 w-[100%] h-[100%] p-2" />
                    </Autocomplete>

                </div>
                {distance !== '' && (
                    <div id="ride-options">
                        <div
                            id="ride-option"
                            className={`flex flex-col border-2 rounded-md p-2 m-2 ${rideOpt === 'Car' ? 'border-black' : 'border-gray-300'
                                }`}
                            onClick={() => setRideOpt('Car')}
                        >

                            <div className="flex justify-between">
                                <span id="vehicle">Car</span>
                                <span id="fare">
                                    Rs. {(parseFloat(distance.split(' ')[0]) * 13).toFixed(2)}
                                </span>

                            </div>
                            <div className="flex justify-end">
                                <span id="distance">{distance}</span>
                            </div>
                        </div>
                        <div
                            id="ride-option"
                            className={`flex flex-col border-2 rounded-md p-2 m-2 ${rideOpt === 'Auto' ? 'border-black' : 'border-gray-300'
                                }`}
                            onClick={() => setRideOpt('Auto')}
                        >

                            <div className="flex justify-between">
                                <span id="vehicle">Auto</span>
                                <span id="fare">
                                    Rs. {(parseFloat(distance.split(' ')[0]) * 10).toFixed(2)}
                                </span>

                            </div>
                            <div className="flex justify-end">
                                <span id="distance">{distance}</span>
                            </div>
                        </div>
                    </div>
                )}


                <button className="border-2 border-blue-500 rounded-md bg-blue-500 p-2 mx-2 my-2" onClick={calculateRoute}>Search</button>
                <button className="border-2 border-blue-500 rounded-md bg-blue-500 p-2 mx-2 my-2" onClick={clearRoute}>Clear</button>
                {
                    distance !== '' && (
                        <button
                            className="border-2 border-blue-500 rounded-md bg-blue-500 p-2 disabled:bg-blue-200 my-2"
                            disabled={!rideOpt}
                            onClick={publishRide}
                        >
                            Confirm Ride
                        </button>
                    )
                }

            </div>
            <div id="map-with-dist" className="border-2 border-gray-300 w-[65%]">
                <GoogleMap
                    center={center}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={map => setMap(map)}
                >
                    <Marker position={center} />
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                    )}
                </GoogleMap>
            </div>
        </div>
    ) : null
}
export default PlacesComponent4;