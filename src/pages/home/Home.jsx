import { Box, Typography } from '@mui/material';
import React , {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context"
import { firestore } from "../../firebase";
import { collection, doc, getDoc } from "firebase/firestore";

export default function Home() {
  const { email, address, setAddress } = useGlobalContext();
  const navigate = useNavigate();
  const goNeighbours = () => { navigate("/neighbours") }
  const goMatched = () => { navigate("/matched") }

  if (email !== "") {
    const db = firestore;
    const usersCollectionRef = collection(db, 'users');
    const documentRef = doc(usersCollectionRef, email);

    getDoc(documentRef)
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
      } else {
        console.log('Document not found');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });


  }

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSaveClick = () => {
    setAddress(inputValue)
  };

  return (
    <>
    <Box
        sx={{
            backgroundColor: '#FF0'
        }}
    >    
    <Typography
        sx={{
            fontSize: '200px',
            justifyContent: 'center',
            alignItems: 'center'
        }}    
    >
        Sup Niggers
    </Typography>
    </Box>



    <button onClick={goNeighbours}> My neighbours </button>
    <button onClick={goMatched}> My ride </button>
   
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleSaveClick}>Save</button>
    </div>

   

    </>
  );
}
