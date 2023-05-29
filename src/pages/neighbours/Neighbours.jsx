import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import ProfileCard from "../../components/ProfileCard";
import { firestore } from "../../firebase";
import { useGlobalContext } from "../../context";

export default function Neighbours() {
  const { email } = useGlobalContext();
  const [documentsArray, setDocumentsArray] = useState([]);
  const [myTown, setMyTown] = useState("");
  const db = firestore;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myTownshipResult = await myTownship();
        await fetchDocumentIds(myTownshipResult);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
  
    const myTownship = async () => {
      const docRef = doc(db, 'users', email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        const data = docSnap.data();
        console.log(data.township);
        setMyTown(data.township);
        return data.township;
      } else {
        console.log('No such document!');
        return '';
      }
    };
  
    const fetchDocumentIds = async (myTownshipResult) => {
      try {
        const collectionRef = collection(db, myTownshipResult);
        const querySnapshot = await getDocs(collectionRef);
        let documents = querySnapshot.docs
          .map((doc) => doc.id)
          .filter((id) => id !== email && id !== 'info');
        console.log('documents');
        console.log(documents);
        setDocumentsArray(documents);
      } catch (error) {
        console.log('Error fetching document IDs:', error);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <>
      <Box sx={{ backgroundColor: "#FFFFFF" }}>
        <Typography
          sx={{
            fontSize: "100px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Neighbours
        </Typography>
      </Box>

      {documentsArray.map((documentId) => (
        <ProfileCard key={documentId} documentId={documentId} />
      ))}
    </>
  );
}
