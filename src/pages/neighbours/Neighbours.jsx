import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import ProfileCard from "../../components/ProfileCard";
import { firestore } from "../../firebase";
import { useGlobalContext } from "../../context";
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import { googleLibraries } from "../../geometry";

export default function Neighbours() {
  const { email } = useGlobalContext();
  const [documentsArray, setDocumentsArray] = useState([]);
  const [myTown, setMyTown] = useState("");
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const db = firestore;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myTownshipResult = await myTownship();
        await fetchDocumentIds(myTownshipResult);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    const myTownship = async () => {
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const data = docSnap.data();
        console.log(data.township);
        setMyTown(data.township);
        return data.township;
      } else {
        console.log("No such document!");
        return "";
      }
    };

    const fetchDocumentIds = async (myTownshipResult) => {
      try {
        const collectionRef = collection(db, myTownshipResult);
        const querySnapshot = await getDocs(collectionRef);
        let documents = querySnapshot.docs
          .map((doc) => doc.id)
          .filter((id) => id !== email && id !== "info");
        console.log("documents");
        console.log(documents);
        setDocumentsArray(documents);
      } catch (error) {
        console.log("Error fetching document IDs:", error);
      }
    };

    fetchData();
  }, []);

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

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Typography
          sx={{
            fontSize: "50px",
            marginTop: "16px",
          }}
        >
          Neighbours
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        sx={{
          backgroundColor: "#FFFFFF",
          width: "100%",
        }}
      >
        <Box
          dislay="flex"
          flexDirection="row"
          width="60%"
          maxHeight="75vh"
          margin="24px 0px 24px 24px"
          sx={{
            overflowY: "scroll",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {documentsArray.length === 0 ? (
            <Typography variant="h5">You have no neighbours!</Typography>
          ) : (
            documentsArray.map((documentId) => (
              <ProfileCard
                key={documentId}
                documentId={documentId}
                isRequest={true}
              />
            ))
          )}
        </Box>

        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            display: "flex",
            height: "75vh",
            width: "40%",
            position: "relative",
            flexDirection: "row",
            alignItems: "right",
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
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
      </Box>
    </>
  );
}
