import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import ProfileCard from '../../components/ProfileCard';
import { firestore } from '../../firebase';
import { useGlobalContext } from "../../context"

export default function Neighbours() {
  //const { email } = useGlobalContext();
  const [documentsArray, setDocumentsArray] = useState([]);

  useEffect(() => {
    const fetchDocumentIds = async () => {
      try {
        const db = firestore;
        const collectionRef = collection(db, 'testtown');
        const querySnapshot = await getDocs(collectionRef);
        let documents = querySnapshot.docs.map((doc) => doc.id);
        setDocumentsArray(documents);
      } catch (error) {
        console.log('Error fetching document IDs:', error);
      }
    };
    fetchDocumentIds();
  }, []);

  return (
    <>
      <Box sx={{ backgroundColor: '#FF0' }}>
        <Typography sx={{ fontSize: '100px', justifyContent: 'center', alignItems: 'center' }}>Neighbours</Typography>
      </Box>
      
      {documentsArray.map((documentId) => (
        <ProfileCard key={documentId} documentId={documentId} />
      ))}
    </>
  );
}
