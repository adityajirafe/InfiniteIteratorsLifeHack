import { Box } from "@mui/material";
import React from "react";
// import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";

export default function Home() {
  //   const { isLoaded } = useJsApiLoader({
  //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   });

  //   const center = { lat: 48.8584, lng: 2.2945 };
  //   if {!isLoaded} return (
  //     <>
  //       <Box
  //         sx={{
  //           backgroundColor: "#FF0",
  //         }}
  //       >
  //         <Typography> is Loading</Typography>
  //       </Box>
  //     </>
  //   )
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FF0",
        }}
      >
        {/* <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        ></GoogleMap> */}
      </Box>
    </>
  );
}
