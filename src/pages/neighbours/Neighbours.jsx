import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import ProfileCard from "../../components/ProfileCard";
import { firestore } from "../../firebase";
import { useGlobalContext } from "../../context";

export default function Neighbours() {
  // const { email } = useGlobalContext();
  const email = "adi@gmail.com";
  const [documentsArray, setDocumentsArray] = useState([]);
  const [myTown, setMyTown] = useState("");
  const db = firestore;

  useEffect(() => {
    const myTownship = async () => {
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const data = docSnap.data();
        console.log(data.township);
        setMyTown(data.township);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    myTownship();

    const fetchDocumentIds = async () => {
      try {
        const collectionRef = collection(db, myTown);
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
    fetchDocumentIds();
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
