import { useState, useEffect } from 'react';
import { firestore } from "../firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useGlobalContext } from "../context"

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
    <div>
        Name: {fullname}, Contact : {contact}, address: {address} , email: {documentId}
        <button id= {`requestButton_${documentId}`} onClick={() => handleRequest(documentId, email)}> request </button> 
    </div>
  )
};

export default ProfileCard;

