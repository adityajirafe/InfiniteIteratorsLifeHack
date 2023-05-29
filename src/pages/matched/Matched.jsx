/* eslint-disable no-loop-func */
import { Box, Button, InputLabel, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { useGlobalContext } from "../../context";
import ProfileCard from "../../components/ProfileCard";
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import { googleLibraries } from "../../geometry";
import Select from "@mui/material/Select";
import styled from "@emotion/styled";
import { PERMUTATIONS, WORK } from "../../geometry";

const CustomSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== "ismobilescreen",
})(({ ismobilescreen }) => ({
  width: ismobilescreen ? "200px" : "20%",
  "&.Mui-focused": {
    backgroundColor: "transparent",
  },
  height: "100%",
  marginLeft: "0px",
  background: "none",
  "&:hover": {
    background: "none",
  },
}));

export default function Matched() {
    const { email } = useGlobalContext();
    const db = firestore;
    const usersCollection = collection(db, 'users');
    const [hoppers, setHoppers] = useState([]);
    const [map, setMap] = useState(/** @type google.maps.Map */ (null));
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [direction, setDirection] = useState("");

    const successfulMatch = async (email) => {
        const userDoc = doc(usersCollection, email);
        const docSnapshot = await getDoc(userDoc);
        
        if (docSnapshot.exists()) {
            const documentData = docSnapshot.data();
            const requests = documentData.requests;
            console.log("requests", requests)
            
            requests.forEach((req) => {
                if (req === "") {
                    console.log("skip");
                } else {
                    const userDoc2 = doc(usersCollection, req);
                    getDoc(userDoc2)
                    .then((docSnapshot) => {        
                        if (docSnapshot.exists()) {
                            const documentData2 = docSnapshot.data();
                            const requests2 = documentData2.requests; // see this person's requests
                            //console.log('requests222:', requests2);
                            //console.log(req);
                            //console.log(requests2.includes(email)); // check if I'm in their requests

                            if(requests2.includes(email)) {
                                const myHoppers =  documentData.hoppers
                                const matchHoppers = documentData2.hoppers
                                const myUpdatedhoppers = documentData.hoppers.concat(matchHoppers).concat(req);
                                const matchUpdatedhoppers = documentData2.hoppers.concat(myHoppers).concat(email);
                                //console.log("matchUpdatedhoppers",matchUpdatedhoppers)
                                //console.log("myUpdatedhoppers",myUpdatedhoppers)
                                updateDoc(userDoc, {
                                    hoppers: myUpdatedhoppers
                                  })
                                updateDoc(userDoc2, {
                                    hoppers: matchUpdatedhoppers
                                }) 
                                
                                
                                const uniqueArray = Array.from(new Set(myUpdatedhoppers));
                                setHoppers(uniqueArray)
                                console.log("helloooo")
                                console.log(uniqueArray)
                            }
                        }
                    });
                } 
            });
        }  
    }
      requests.forEach((req) => {
        if (req === "") {
          console.log("skip");
        } else {
          console.log(req);
          const userDoc2 = doc(usersCollection, req);
          getDoc(userDoc2).then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const documentData2 = docSnapshot.data();
              const requests2 = documentData2.requests; // see this person's requests
              //console.log('requests222:', requests2);
              //console.log(req);
              //console.log(requests2.includes(email)); // check if I'm in their requests

              if (requests2.includes(email)) {
                const myHoppers = documentData.hoppers;
                console.log("MY HOPPERS:", myHoppers);
                const matchHoppers = documentData2.hoppers;
                const myUpdatedhoppers = documentData.hoppers
                  .concat(matchHoppers)
                  .concat(req);
                const matchUpdatedhoppers = documentData2.hoppers
                  .concat(myHoppers)
                  .concat(email);
                //console.log("matchUpdatedhoppers",matchUpdatedhoppers)
                //console.log("myUpdatedhoppers",myUpdatedhoppers)
                updateDoc(userDoc, {
                  hoppers: myUpdatedhoppers,
                });
                updateDoc(userDoc2, {
                  hoppers: matchUpdatedhoppers,
                });

                const uniqueArray = Array.from(new Set(myUpdatedhoppers));
                setHoppers(uniqueArray);
              }
            }
          });
        }
      });
    }
    await getAddresses(email);
  };

  const [routes, setRoutes] = useState(null);

  //   const findRoute = async () => {
  //     // eslint-disable-next-line no-undef
  //     const directionService = new google.maps.DirectionsService();

  //     const route = WORK.concat(passengers, driver);
  //     console.log(route);
  //     const numStops = passengers.length + 1;
  //     const routeResult = {};

  //     const numPermutations = PERMUTATIONS[numStops].length;
  //     console.log(numPermutations);

  //     for (var i = 0; i < numPermutations; i++) {
  //       for (var j = 0; j < numStops - 1; j++) {
  //         const results = await directionService.route({
  //           origin: route[PERMUTATIONS[numStops][i][j]],
  //           destination: route[PERMUTATIONS[numStops][i][j + 1]],
  //           // eslint-disable-next-line no-undef
  //           travelMode: google.maps.TravelMode.DRIVING,
  //         });

  //         if (routeResult.hasOwnProperty(i)) {
  //           routeResult[i][0] += parseFloat(
  //             results.routes[0].legs[0].distance.text.split(" ")
  //           );
  //           routeResult[i][1].push(results);
  //         } else {
  //           routeResult[i] = [
  //             parseFloat(results.routes[0].legs[0].distance.text.split(" ")),
  //             [results],
  //           ];
  //         }
  //       }
  //     }
  //     let minDistance = Infinity;
  //     let minPair = null;

  //     for (const pair in routeResult) {
  //       const distance = routeResult[pair][0];
  //       if (distance < minDistance) {
  //         minDistance = distance;
  //         minPair = routeResult[pair][1];
  //       }
  //     }
  //     console.log("PAIR: ", minPair);
  //     setRoutes(minPair);
  //   };

  //   console.log("route", routes);

  const [addressList, setAddressList] = useState([]);
  const [coordList, setCoordList] = useState([]);
  const [routeDistance, setRouteDistance] = useState(0);

  const getAddresses = async () => {
    const usersCollectionRef = collection(db, "users");
    const documentRef = doc(usersCollectionRef, email);
    const addressArray = [];

    const docSnap = await getDoc(documentRef);
    let fullname = "";
    let contact = "";
    let address = "";
    let hoppersList = [];
    if (docSnap.exists()) {
      const data = docSnap.data();
      fullname = data.fullname;
      contact = data.contact;
      address = data.address;
      hoppersList = data.hoppers;
      const uniqueArray = Array.from(new Set(hoppersList));
      addressArray.push(address);
      console.log(uniqueArray);

      for (let emailId of uniqueArray) {
        if (emailId !== "") {
          const documentRef2 = doc(usersCollectionRef, emailId);
          const docSnap2 = await getDoc(documentRef2);
          if (docSnap2.exists()) {
            const data = docSnap2.data();
            fullname = data.fullname;
            contact = data.contact;
            address = data.address;
            addressArray.push(address);
            console.log("ADDRESS", data);
          } else {
            console.log("Document not found");
          }
        }
      }
    } else {
      console.log("Document not found");
    }

    console.log(addressArray);
    const uniqueAddressArray = Array.from(new Set(addressArray));
    setAddressList(uniqueAddressArray);

    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    const coords = [];

    for (let location of uniqueAddressArray) {
      const originPromise = new Promise((resolve, reject) => {
        geocoder.geocode({ address: location }, (results, status) => {
          // eslint-disable-next-line no-undef
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error("Geocoding failed for origin address."));
          }
        });
      });
      try {
        const coordinates = await Promise.all([originPromise]);
        coords.push(coordinates[0]);
      } catch (error) {
        console.log(error.message);
      }
    }
    setCoordList(coords);

    //
    const route = WORK.concat(coords);
    console.log(route);
    const numStops = uniqueAddressArray.length + 1;
    const routeResult = {};


    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();

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
    setRouteDistance(minDistance);
  };

  const deleteUser = async () => {
    await deleteDoc(doc(db, "users", "test2@gmail.com"));
    await deleteDoc(doc(db, "users", "joe@gmail.com"));
  };

  useEffect(() => {}, []);

  const onDirectionTo = () => {
    setDirection("to");
  };

  const onDirectionFrom = () => {
    setDirection("from");
  };

  // googlemaps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: googleLibraries,
  });

  const center = { lat: 1.3521, lng: 103.8198 };

  if (!isLoaded) {
    return (
        <Box>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
          }}
        >
          <Typography> is Loading</Typography>
        </Box>

        <div>
          {hoppers.map((documentId) => (
            <ProfileCard key={documentId} documentId={documentId} />
          ))}
        </div>
      </>
    );
  }

  const handleChange = (e) => {
    setSelectedDriver(e.target.value);
  };

  return (
    <Box>
      <Box display="flex" flexDirection="column"></Box>
      <Box display="flex" justifyContent="center">
        <Typography
          sx={{
            fontSize: "50px",
            marginTop: "16px",
          }}
        >
          Matched
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        margin="24px"
        height="40px"
        width="97%"
      >
        <Box display="flex" flexDirection="row" justifyContent="left">
          <Button
            variant="filled"
            // id= {`requestButton_${documentId}`}
            onClick={onDirectionTo}
            sx={{
              backgroundColor:
                direction === "to"
                  ? (theme) => theme.palette.secondary.main
                  : "#36454F",
              "&:hover": {
                background: (theme) => theme.palette.secondary.main,
              },
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
              }}
            >
              To
            </Typography>
          </Button>
          <Button
            variant="filled"
            // id= {`requestButton_${documentId}`}
            onClick={onDirectionFrom}
            sx={{
              backgroundColor:
                direction === "from"
                  ? (theme) => theme.palette.secondary.main
                  : "#36454F",
              "&:hover": {
                background: (theme) => theme.palette.secondary.main,
              },
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
              }}
            >
              From
            </Typography>
          </Button>
        </Box>

        <Button
          variant="filled"
          // id= {`requestButton_${documentId}`}
          onClick={successfulMatch}
          sx={{
            backgroundColor:
              direction === "from"
                ? (theme) => theme.palette.secondary.main
                : "#36454F",
            "&:hover": {
              background: (theme) => theme.palette.secondary.main,
            },
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
            }}
          >
            Get Matches
          </Typography>
        </Button>

        <Button
          variant="filled"
          // id= {`requestButton_${documentId}`}
          onClick={getAddresses}
          sx={{
            backgroundColor:
              direction === "from"
                ? (theme) => theme.palette.secondary.main
                : "#36454F",
            "&:hover": {
              background: (theme) => theme.palette.secondary.main,
            },
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
            }}
          >
            Get Route
          </Typography>
          <Typography
            sx={{
              color: "#FFFFFF",
            }}
          >
            Distance: {routeDistance}km
          </Typography>
        </Button>

        <Box display="flex" justifyContent="right" width="100%">
          <InputLabel
            id="select-placeholder"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              padding: "7px 10px 7px 10px",
              border: "1px solid",
              borderRadius: "4px",
              backgroundColor: "#36454F",
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
              }}
            >
              Select a Driver
            </Typography>
          </InputLabel>
          <CustomSelect
            variant="outlined"
            value={selectedDriver?.fullname || ""}
            onChange={handleChange}
          ></CustomSelect>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          display: "flex",
          height: "40vh",
          width: "97vw",
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "right",
          zIndex: "modal",
          margin: "24px",
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
          {routes &&
            routes?.map((item) => (
              <DirectionsRenderer
                key={item.id}
                directions={item}
                options={{ preserveViewport: true }}
              />
            ))}
        </GoogleMap>
      </Box>

      <Box display="flex" flexDirection="row" flexWrap={true} width="97%">
        {/* {documentsArray.map((documentId) => (
                    <ProfileCard key={documentId} documentId={documentId} isRequest={false} />
                ))} */}
      </Box>
    </Box>
  );
                {hoppers.map((documentId) => {
                    if (documentId === "") {
                    return null; // Skips this iteration
                    }
                    return <ProfileCard key={documentId} documentId={documentId} />;
                })}
            </Box>      
        </Box>
        
    );
}
