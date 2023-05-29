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
import { checkWithinRadius, getCoords, findRoute } from "../../geometry";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
import { firestore } from "../../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { googleLibraries } from "../../geometry";
import TextField from "@mui/material/TextField";

export default function Home() {
  // firebase

  const { email, address, setAddress, setTownship } = useGlobalContext();

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

  /** @type React.MutableRefObject<HTMLInputElement> */
  // const routes = useRef(null);

  // const [routes, setRoutes] = useState(null);

  // const getRoutes = async () => {
  //   // routes.current.value = await findRoute()[1];
  //   // const routes = await findRoute()[1];
  //   // setRoutes(routes);
  //   setRoutes(await findRoute()[1]);
  //   console.log("ROUTES", routes);
  // };

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

  const [routes, setRoutes] = useState(null);

  const WORK = [
    {
      lat: 1.2805182897109721,
      lng: 103.85430153739446,
    },
  ];

  const driver = [
    {
      lat: 1.430353468178358,
      lng: 103.78573705283941,
    },
  ];

  const passengers = [
    {
      lat: 1.4404865606459663,
      lng: 103.79780752591975,
    },
    {
      lat: 1.4449562454354568,
      lng: 103.79048497059544,
    },
    //   {
    //     latitude: 1.4445869699498342,
    //     longitude: 103.80507396760258,
    //   },
  ];

  const PERMUTATIONS = {
    1: [[0, 1]],
    2: [[0, 1, 2]],
    3: [
      [0, 1, 2, 3],
      [0, 2, 1, 3],
    ],
    4: [
      [0, 1, 2, 3, 4],
      [0, 1, 3, 2, 4],
      [0, 2, 3, 1, 4],
      [0, 2, 1, 3, 4],
      [0, 3, 1, 2, 4],
      [0, 3, 2, 1, 4],
    ],
    5: [[0, 1, 2, 3, 4, 5]],
    6: [[0, 1, 2, 3, 4, 5, 6]],
    7: [[0, 1, 2, 3, 4, 5, 6, 7]],
  };

  const findRoute = async () => {
    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();

    const route = WORK.concat(passengers, driver);
    console.log(route);
    const numStops = passengers.length + 1;
    const routeResult = {};

    const numPermutations = PERMUTATIONS[numStops].length;
    console.log(numPermutations);

    for (var i = 0; i < numPermutations; i++) {
      for (var j = 0; j < numStops - 1; j++) {
        const results = await directionService.route({
          origin: route[PERMUTATIONS[numStops][i][j]],
          destination: route[PERMUTATIONS[numStops][i][j + 1]],
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        });

        if (routeResult.hasOwnProperty(i)) {
          routeResult[i][0] += parseFloat(
            results.routes[0].legs[0].distance.text.split(" ")
          );
          routeResult[i][1].push(results);
        } else {
          routeResult[i] = [
            parseFloat(results.routes[0].legs[0].distance.text.split(" ")),
            [results],
          ];
        }
      }
    }
    let minDistance = Infinity;
    let minPair = null;

    for (const pair in routeResult) {
      const distance = routeResult[pair][0];
      if (distance < minDistance) {
        minDistance = distance;
        minPair = routeResult[pair][1];
      }
    }
    console.log("PAIR: ", minPair);
    setRoutes(minPair);
  };

  console.log("route", routes);

  const center = { lat: 1.3521, lng: 103.8198 };
  if (!isLoaded) {
    return (
      <>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
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
          backgroundColor: "#FFFFFF",
          //   display: "flex",
          height: "93vh",
          width: "100vw",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
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
          {/* {routes && <DirectionsRenderer directions={routes} />} */}
          {routes &&
            routes?.map((item) => (
              <DirectionsRenderer
                key={item.id}
                directions={item}
                options={{ preserveViewport: true }}
              />
            ))}
          {lat ? (
            <MarkerF position={{ lat: lat, lng: lng }} />
          ) : (
            <MarkerF position={center} />
          )}
        </GoogleMap>
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          zIndex: 1,
          height: "200px",
          width: "425px",
          position: "absolute",
          top: 100,
          right: 40,
          borderRadius: "30px",
          boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Autocomplete>
          <TextField
            variant="filled"
            placeholder="Enter postal code"
            onChange={handleInputChange}
            value={inputValue}
            sx={{
              width: "296px",
              borderRadius: "30px",
            }}
          />
        </Autocomplete>
        <br/>
        <Button onClick={handleSaveClick}>Save Address</Button>
      </Box>
    </Box>
  );
}
