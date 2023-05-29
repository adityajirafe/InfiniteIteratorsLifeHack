import { Box, Typography } from '@mui/material';
import React from 'react';
import { doc, getDoc, collection, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useGlobalContext } from "../../context"

export default function Matched() {
    const { email } = useGlobalContext();

    const successfulMatch = (email) => {
        const db = firestore
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection, email);
        
        getDoc(userDoc)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const documentData = docSnapshot.data();
            const requests = documentData.requests
            console.log('requests:', requests); //iterate through the requests made by this user


            requests.forEach((req) => { //for each person i requested to share ride with
                const db = firestore
                const usersCollection = collection(db, 'users');
                const userDoc2 = doc(usersCollection, req);

                getDoc(userDoc2)
                .then((docSnapshot) => {        
                    if (docSnapshot.exists()) {
                        const documentData2 = docSnapshot.data();
                        const requests2 = documentData2.requests //see this persons requests
                        console.log('requests222:', requests2);
                        console.log(req)
                        console.log(requests2.includes(email)); //check if im in his request
                        

                        if(requests2.includes(email)) { //will need to update both ends
                            const updatedhoppers = [...documentData.hoppers, req]
                            const updatedhoppers2 = [...documentData2.hoppers, email]
                            console.log("my hoppers",updatedhoppers)
                            updateDoc(userDoc, {
                                hoppers: updatedhoppers
                              })
                            .then(() => {
                                console.log('Document updated successfully.');
                            })
                            .catch((error) => {
                                console.log('Error updating document:', error);
                            });

                            updateDoc(userDoc2, {
                                hoppers: updatedhoppers2
                              })
                            .then(() => {
                                console.log('Document updated successfully.');
                            })
                            .catch((error) => {
                                console.log('Error updating document:', error);
                            });
                              
                        }


                    } else {
                        console.log('Document does not exist2!');
                }
                })
                .catch((error) => {
                console.log('Error getting document2:', error);
                });

              });
    
          } else {
            console.log('Document does not exist!');
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });

      
      
      
      
      
      
      


    }

      
    return (
        <>
        <Box sx={{ backgroundColor: '#FFFFFF' }}>
            <Typography sx={{ fontSize: '100px', justifyContent: 'center', alignItems: 'center' }}>matched</Typography>
        </Box>
        <button onClick={() => successfulMatch(email)}> testing </button>
        
        
        </>
    );
}
