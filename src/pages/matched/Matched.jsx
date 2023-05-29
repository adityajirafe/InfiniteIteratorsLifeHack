import { Box, Typography } from '@mui/material';
import React, {useEffect, useState} from 'react';
import { doc, getDoc, collection, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useGlobalContext } from "../../context";
import ProfileCard from "../../components/ProfileCard";

export default function Matched() {
    const { email } = useGlobalContext();
    const db = firestore;
    const usersCollection = collection(db, 'users');
    const [hoppers, setHoppers] = useState([]);

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
                    console.log(req);
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
      
    return (
        <>
        <Box sx={{ backgroundColor: '#FF0' }}>
            <Typography sx={{ fontSize: '100px', justifyContent: 'center', alignItems: 'center' }}>matched</Typography>
        </Box>
        
        <div>

        {hoppers.map((documentId) => (
            <ProfileCard key={documentId} documentId={documentId} />
        ))}

      </div>


        
        
        </>
    );
}
