import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useJsApiLoader } from "@react-google-maps/api";
import RideNotificationCard from "../components/RideNotificationCard";

const libraries = []; // add 'places' here if needed

const CaptainHome = () => {
  const [rides, setRides] = useState([]);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY, // 🔐 Replace with your key
    libraries: libraries,
  });

  // Function to get location name from lat/lng
  async function getLocationName(location) {
    if (
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number"
    ) {
      throw new Error("Invalid location object");
    }

    const geocoder = new window.google.maps.Geocoder();
    const latlng = new window.google.maps.LatLng(
      location.latitude,
      location.longitude
    );

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject(new Error("No results found"));
          }
        } else {
          reject(new Error("Geocoder failed due to: " + status));
        }
      });
    });
  }

  // Enrich ride with human-readable pickup/drop names
  const enrichRideWithLocationNames = async (ride) => {
    try {
      const pickupAddress = await getLocationName(ride.pickup);
      const dropAddress = await getLocationName(ride.drop);

      setRides((prevRides) =>
        prevRides.map((r) =>
          r._id === ride._id
            ? {
              ...r,
              pickupAddress,
              dropAddress,
            }
            : r
        )
      );
    } catch (error) {
      console.error("Error getting location names:", error);
    }
  };

  // Socket connection + fetching
  useEffect(() => {
    if (!isLoaded) return; // wait for Maps API to load

    const socket = io(`${VITE_WS_URL}`);

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("new-ride-request-received", async (newRide) => {
      // Add ride first, then enrich
      setRides((prevRides) => [...prevRides, newRide]);
      await enrichRideWithLocationNames(newRide);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    return () => {
      socket.disconnect();
    };
  }, [isLoaded]);

  return (
    <div>
      <h2>Ride Requests</h2>
      <ul>
        {rides.map((ride, index) => (
          <li key={index}>
            <strong>Pickup:</strong>{" "}
            {ride.pickupAddress || `${ride.pickup.latitude}, ${ride.pickup.longitude}`}{" "}
            | <strong>Dropoff:</strong>{" "}
            {ride.dropAddress || `${ride.drop.latitude}, ${ride.drop.longitude}`}
            <br />
            
            <RideNotificationCard></RideNotificationCard>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaptainHome;
