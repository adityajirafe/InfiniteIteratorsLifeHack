import { useState, useEffect } from 'react';
import { firestore } from "../firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useGlobalContext } from "../context"
import { Box, Button, Typography, useTheme } from '@mui/material';
import styled from '@emotion/styled';

const CardContainer = styled(Box)(({ theme }) => (
  { display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '16px',
    margin: '0px 0px 16px 0px',
    gap: '8px',
    height: '84px',
    borderRadius: '12px',
    width: '90%',
  }
));

const ProfileCard = ({ documentId }) => {
  const { email } = useGlobalContext();
  const [fullname, setFullname] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchFullname = async () => {
      try {
        const db = firestore;
        const usersCollectionRef = collection(db, 'users');
        const documentRef = doc(usersCollectionRef, documentId);

        let fullname = ''; 
        let contact = ''; 
        let address = ''; 

        const docSnap = await getDoc(documentRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          fullname = data.fullname; 
          contact = data.contact;
          address = data.address;
        } else {
          console.log('Document not found');
        }

        setFullname(fullname); 
        setContact(contact); 
        setAddress(address); 
      } catch (error) {
        console.log('Error getting document:', error);
      }
    };

    fetchFullname();
  }, [documentId]);

  const handleRequest = async(documentId, email) => { //made a request to carpool with this person (documentId) . user is stored in his requests list
    const button = document.getElementById(`requestButton_${documentId}`);
    button.disabled = true;
    const db = firestore;
    const documentRef = doc(db, 'users', documentId);
    const documentSnapshot = await getDoc(documentRef);
    if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        const updatedRequest = [...data.requests, email]
        await updateDoc(documentRef, {
            requests: updatedRequest
          });
        console.log("request made successfully")

      } else {
        console.log('Document does not exist');
      }
  }

  return (
    <CardContainer
      sx={{
        backgroundColor: (theme) => theme.palette.primary.main,
      }}
    >
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
    >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="left"
        >
          <Typography
            sx={{
              color: "#FFFFFF"
            }}
          >
            Name: {fullname}
          </Typography>
          <Typography
            sx={{
              color: "#FFFFFF"
            }}
          >
            Contact : {contact}
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="left"
        >
          <Typography
            sx={{
              color: "#FFFFFF"
            }}
          >
            address: {address}
          </Typography>

          <Typography
            sx={{
              color: "#FFFFFF"
            }}
          >
            email: {documentId}
          </Typography>
        </Box>

        <Button
          variant="filled" 
          id= {`requestButton_${documentId}`}
          onClick={() => handleRequest(documentId, email)}
          sx={{
            backgroundColor: '#36454F',
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
            Request
          </Typography>
        </Button> 

      </Box>
            
    </CardContainer>
  )
};

export default ProfileCard;

