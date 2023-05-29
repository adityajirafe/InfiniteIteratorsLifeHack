import { Box, Button, InputLabel, Typography } from '@mui/material';
import React, {useEffect, useState} from 'react';
import { doc, getDoc, collection, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useGlobalContext } from "../../context"
import ProfileCard from '../../components/ProfileCard';
import { DirectionsRenderer, GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { googleLibraries } from '../../geometry';
import Select from '@mui/material/Select';
import styled from '@emotion/styled';

const CustomSelect = styled(Select, {
    shouldForwardProp: (prop) => prop !== 'ismobilescreen'
  })((
    { ismobilescreen }
  ) => (
    { width: ismobilescreen ? '200px' : '20%',
      '&.Mui-focused': {
        backgroundColor: 'transparent'
      },
      height: '100%',
      marginLeft: '0px',
      background: 'none',
      '&:hover': {
        background: 'none'
      } }
  ));

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

    useEffect(() => {
        successfulMatch(email);
      }, []);

    const onDirectionTo = () => {
        setDirection("to");
    }

    const onDirectionFrom = () => {
        setDirection("from");
    }

    // googlemaps
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: googleLibraries,
    });

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

    const handleChange = (e) => {
        setSelectedDriver(e.target.value);
    };

    return (
        <Box>
    
        <Box
            display="flex"
            flexDirection="column"
        >

        </Box>
            <Box
                display="flex"
                justifyContent="center"
            >

                <Typography
                    sx={{
                        fontSize: "50px",
                        marginTop: '16px'
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
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="left"
                >
                <Button
                    variant="filled" 
                    // id= {`requestButton_${documentId}`}
                    onClick={onDirectionTo}
                    sx={{
                        backgroundColor: (direction === "to") ? (theme) => theme.palette.secondary.main : '#36454F',
                        '&:hover': {
                        background: (theme) => theme.palette.secondary.main
                        }
                    }}
                    > 
                    <Typography
                        sx={{
                        color: "#FFFFFF"
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
                        backgroundColor: (direction === "from") ? (theme) => theme.palette.secondary.main : '#36454F',
                        '&:hover': {
                        background: (theme) => theme.palette.secondary.main
                        }
                    }}
                    > 
                    <Typography
                        sx={{
                        color: "#FFFFFF"
                        }}
                    >
                        From
                    </Typography>
                </Button>
                </Box> 

                <Box
                    display="flex"
                    justifyContent="right"
                    width="100%"
                >
                <InputLabel 
                    id="select-placeholder"
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '7px 10px 7px 10px',
                        border: '1px solid',
                        borderRadius: '4px',
                        backgroundColor: '#36454F'
                    }}
                >
                    <Typography
                        sx={{
                            color: '#FFFFFF'
                        }}
                    >
                        Select a Driver
                    </Typography>
                </InputLabel>
                <CustomSelect
                    variant="outlined"
                    value={selectedDriver?.fullname || ''}
                    onChange={handleChange}
                >
                

                </CustomSelect>
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
            margin: '24px'
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
          </GoogleMap>
        </Box>

            <Box
                display="flex"
                flexDirection="row"
                flexWrap={true}
                width="97%"
            >
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
