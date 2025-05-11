
import React from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";



const center = {
  lat: 53.54,
  lng: 10
}

function MyComponent() {
  return (
    <APIProvider apiKey="AIzaSyBCIp7JfZkdYNu6v1V-5F7tlcVPpXNmMDg">
      <div style={{ height: '100vh', width: '100vw'}}>
        <Map center={center} 
        zoom={12}
        mapId="b648e36a0c96746">
          <AdvancedMarker position={center}>
            <Pin background={"green"} />
            
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  )
}

export default MyComponent