import { Box, Button, Input, Typography } from "@mui/material";
import React, { useState, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"],
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();

    const originPromise = new Promise((resolve, reject) => {
      geocoder.geocode(
        { address: originRef.current.value },
        (results, status) => {
          // eslint-disable-next-line no-undef
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            resolve(results[0].geometry.location);
            setLat(results[0].geometry.location.lat());
            setLng(results[0].geometry.location.lng());
          } else {
            reject(new Error("Geocoding failed for origin address."));
          }
        }
      );
    });

    const destinationPromise = new Promise((resolve, reject) => {
      geocoder.geocode(
        { address: destinationRef.current.value },
        (results, status) => {
          // eslint-disable-next-line no-undef
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error("Geocoding failed for destination address."));
          }
        }
      );
    });

    try {
      const [originCoordinates, destinationCoordinates] = await Promise.all([
        originPromise,
        destinationPromise,
      ]);
      // eslint-disable-next-line no-undef
      const directionService = new google.maps.DirectionsService();

      const results = await directionService.route({
        origin: originCoordinates,
        destination: destinationCoordinates,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
    } catch (error) {
      console.log(error.message);
    }
  }

  const center = { lat: 1.3521, lng: 103.8198 };
  if (!isLoaded) {
    return (
      <>
        <Box
          sx={{
            backgroundColor: "#FF0",
          }}
        >
          <Typography> is Loading</Typography>
        </Box>
      </>
    );
  }
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FF0",
          //   display: "flex",
          height: "50vh",
          width: "100vw",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          zIndex: "modal",
        }}
      >
        <GoogleMap
          center={center}
          zoom={10}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
          }}
        >
          <MarkerF position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {lat && <MarkerF position={{ lat: lat, lng: lng }} />}
        </GoogleMap>
      </Box>
      <Box
        sx={{
          backgroundColor: "green",
          justifySelf: "center",
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        <Autocomplete>
          <Input placeholder="Input Origin" inputRef={originRef} />
        </Autocomplete>
        <Autocomplete>
          <Input placeholder="Input Destination" inputRef={destinationRef} />
        </Autocomplete>
        <Button onClick={calculateRoute}>Calculate Route</Button>
        <Typography>{distance}</Typography>
      </Box>
    </>
  );
}
