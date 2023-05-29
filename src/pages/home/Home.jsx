import { Box, Button, Input, Typography } from "@mui/material";
import React, { useState, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
  DistanceMatrixService,
} from "@react-google-maps/api";
import { checkWithinRadius, getCoords } from "../../geometry";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
import { firestore } from "../../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { googleLibraries } from "../../geometry";

export default function Home() {
  // firebase

  const { email, address, setAddress, setTownship } = useGlobalContext();
  const navigate = useNavigate();
  const goNeighbours = () => {
    navigate("/neighbours");
  };
  const goMatched = () => {
    navigate("/matched");
  };

  if (email !== "") {
    const db = firestore;
    const usersCollectionRef = collection(db, "users");
    const documentRef = doc(usersCollectionRef, email);

    getDoc(documentRef)
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSaveClick = async () => {
    const coords = await getCoords(inputValue);
    setLat(coords.latitude);
    setLng(coords.longitude);
    setAddress(inputValue);
    const township = (await checkWithinRadius(inputValue)).township;
    console.log(township);
    setTownship(township);
    const db = firestore;
    const townshipRef = doc(collection(db, township), email);
    await setDoc(townshipRef, {});
  };

  // googlemaps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: googleLibraries,
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const getMatrix = async () => {
    // eslint-disable-next-line no-undef
    const service = new google.maps.DistanceMatrixService();
    const origin1 = "Singapore 737938";
    const destination1 = "Singapore 117417";
    const destination2 = "Singapore 819663";
    const destination3 = "Singapore 680563";

    // console.log("GEOCODER: ", getCoords(origin1));
    console.log("result is ", checkWithinRadius(origin1));

    const request = {
      origins: [origin1],
      destinations: [destination1, destination2, destination3],
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      // eslint-disable-next-line no-undef
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    // service.getDistanceMatrix(request).then((response) => {
    //   console.log(response);
    // });
  };

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
            // map.panTo({
            //   lat: results[0].geometry.location.lat(),
            //   lng: results[0].geometry.location.lng(),
            // });
            // map.setZoom(15);
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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          backgroundColor: "#FF0",
          //   display: "flex",
          height: "60vh",
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
          onLoad={(map) => setMap(map)}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {lat ? (
            <MarkerF position={{ lat: lat, lng: lng }} />
          ) : (
            <MarkerF position={center} />
          )}
        </GoogleMap>
      </Box>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.tabs,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          //   zIndex: 1,
          height: "40vh",
          width: "100vw",
        }}
      >
        <Autocomplete>
          <Input
            placeholder="Input Origin"
            onChange={handleInputChange}
            value={inputValue}
          />
        </Autocomplete>
        <Button onClick={handleSaveClick}>Save Address</Button>
        <Typography>{distance}</Typography>

        <button onClick={goNeighbours}> My neighbours </button>
        <button onClick={goMatched}> My ride </button>
      </Box>
    </Box>
  );
}
