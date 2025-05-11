// import { useState } from "react";
// import {
//     useJsApiLoader,
//     GoogleMap,
//     Marker,
//     Autocomplete,
//     DirectionsRenderer,
// } from '@react-google-maps/api'
// function Geocoder() {
//     const { isLoaded } = useJsApiLoader({
//         id: "google-map-script",
//         googleMapsApiKey: "AIzaSyBCIp7JfZkdYNu6v1V-5F7tlcVPpXNmMDg", // Replace with your API key
//         libraries: ["places", "geometry"],
//     });
//     const [address, setAddress] = useState("");
//     const [lat, setLat] = useState("");
//     const [long, setLong] = useState("");
//     function getCoordinatesFromAddress(addressInput) {
//         const geocoder = new window.google.maps.Geocoder();

//         geocoder.geocode({ address: addressInput }, (results, status) => {
//             if (status === window.google.maps.GeocoderStatus.OK) {
//                 const location = results[0].geometry.location;
//                 const lat = location.lat();
//                 const lng = location.lng();
                
//                 console.log("Latitude:", lat, "Longitude:", lng);
//             } else {
//                 console.error("Geocoding failed: " + status);
//             }
//         });
//     }
//     function getLocationName(location) {
//         if (!location || !location.lat || !location.lng) {
//             console.error("Invalid location object");
//             return;
//         }

//         const geocoder = new google.maps.Geocoder();
//         const latlng = new google.maps.LatLng(location.lat, location.lng);

//         geocoder.geocode({ location: latlng }, function (results, status) {
//             if (status === google.maps.GeocoderStatus.OK) {
//                 if (results[0]) {
//                     console.log(results)

//                 } else {
//                     console.log("No results found");
//                 }
//             } else {
//                 console.log("Geocoder failed due to: " + status);
//             }
//         });
//     }

//     return isLoaded ? (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Enter latitude..."
//                 onChange={(e) => setLat(e.target.value)}
//             />
//             <input
//                 type="text"
//                 placeholder="Enter longitude..."
//                 onChange={(e) => setLong(e.target.value)}
//             />
//             <button
//                 type="submit"
//                 onClick={() =>
//                     getLocationName(
//                         { lat: parseFloat(lat), lng: parseFloat(long) },

//                     )
//                 }
//             >
//                 Submit
//             </button>
//             <input
//                 type="text"
//                 placeholder="Enter address..."
//                 onChange={(e) => setAddress(e.target.value)}
//             />
//             <button
//                 onClick={() => getCoordinatesFromAddress(address)}
                
//             >
//                 Get Coordinates
//             </button>
//         </div>
//     ) : (<><p>not loaded map api</p></>);
// }

// export default Geocoder;
